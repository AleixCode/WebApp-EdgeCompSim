from nodes import Node
from monitoring import n_message_generator, Event, TypeEvent


class Server(Node):
    ID = 0

    def __init__(self, cpu, mem, hdd, nperiods, p,x,y,input):
        self.id = Server.ID
        self.cpu = cpu
        self.hdd = hdd
        self.mem = mem
        self.on = False
        self.prop = p
        self.queue = []
        self.nperiods = nperiods
        self.resource = None
        self.env = None
        self.monitoring = None
        self.process_swith_off_list = []
        self.input = input

        Node.__init__(self,x,y)

        Server.ID += 1

    def run_server(self):
        raise NotImplementedError

    def __str__(self):
        return f"Server {self.id} {self.prop}"

    def print(self):
        return self.__str__()

    def switch_on(self):
        self.on = True
        if self.cpu.level < self.cpu.capacity:
            self.cpu.put(self.cpu.capacity-self.cpu.level)
        if self.mem.level < self.mem.capacity:
            self.mem.put(self.mem.capacity-self.mem.level)
        if self.hdd.level < self.hdd.capacity:
            self.hdd.put(self.hdd.capacity-self.hdd.level)
        n_message_generator(Event(self.monitoring,self,self, self.env.now, TypeEvent.server_switched_on,
                                  f"server {self.id} is ON, Resources:[{self.cpu.level},{self.mem.level},"
                                  f"{self.hdd.level}]"))
        n_message_generator(Event(self.monitoring, None, self, self.env.now, TypeEvent.server_change_inventary,
                                  f"{self.cpu.level} {self.mem.level} {self.hdd.level}"))

    def switch_off(self):
        raise NotImplementedError

    def complete_task(self,user):

        msg = f"User {user.id} is assigned to Server {self.id} at time {self.env.now}"
        evnt = Event(self.monitoring, user, self, self.env.now, TypeEvent.user_server_assigned, msg)
        n_message_generator(evnt)

        if self.prop != 'D' and not self.on:
            # mongodb
            #n_message_generator(Event(self.monitoring,user, self, self.env.now, TypeEvent.user_rejected,"This server is volunteer, but is switched-off"))
            return

        elif self.prop == 'D' and not self.on:

            n_message_generator(Event(self.monitoring,user, self, self.env.now, TypeEvent.server_switched_on, "This server is ON"))
            self.switch_on()

        with self.cpu.get(user.cpu) as g_cpu, self.mem.get(user.mem) as g_mem, self.mem.get(user.hdd) as g_hdd:

            n_message_generator(Event(self.monitoring, user, self, self.env.now, TypeEvent.user_lock_for_resources,
                                      f"User waiting for resources:{self.cpu.level} {self.mem.level} {self.hdd.level}"))

            results = yield (g_cpu & g_mem & g_hdd) | (self.env.timeout(max(0, user.due_time - self.env.now))) | (self.env.timeout(0.1*user.comp))

            n_message_generator(Event(self.monitoring, user, self, self.env.now, TypeEvent.user_unlock_for_resources,
                                      f"User is unlock:{self.cpu.level} {self.mem.level} {self.hdd.level}"))

            msg, reason = "Ok", ""
            if (g_cpu in results) and (g_mem in results) and (g_hdd in results) and (self.env.now < user.due_time):

                before_time = self.env.now

                n_message_generator(Event(self.monitoring,user,self,self.env.now,TypeEvent.server_change_inventary,
                                          f"{self.cpu.level} {self.mem.level} {self.hdd.level}"))


                yield self.env.timeout(user.comp) | self.env.timeout(max(0, user.due_time - self.env.now))

                after_time = self.env.now

                if user.comp > after_time - before_time:

                    user.comp -= after_time - before_time
                    msg, reason = "fail", "too much time computing"
                    type_event = TypeEvent.user_rejected_not_enough_time
                    # print(f"fallo {user.id} por espera computando")
                else:
                    user.done = True
                    type_event = TypeEvent.user_completed
                    # print(f"User {user.id} en el server {self.id}, done!")

                n_message_generator(Event(self.monitoring,user,self, self.env.now,type_event,msg+" "+reason))

                # print(f"Before: {self.cpu.level} {self.mem.level} {self.hdd.level}")
                #yield (self.cpu.put(user.cpu) & self.mem.put(user.mem) & self.hdd.put(user.hdd) )

                self.cpu.put(user.cpu)
                self.mem.put(user.mem)
                self.hdd.put(user.hdd)

                n_message_generator(Event(self.monitoring,user, self, self.env.now, TypeEvent.server_change_inventary,
                                           f"{self.cpu.level} {self.mem.level} {self.hdd.level}"))

            else:

                type_rejection = TypeEvent.user_rejected_not_enough_resources
                msg, reason = "fail", "because not enough resources"

                users_resources = [user.cpu, user.mem,user.hdd]
                actions = [self.cpu.put, self.mem.put, self.hdd.put]
                for i,b in enumerate([(g_cpu in results),(g_mem in results),(g_hdd in results),(self.env.now < user.due_time)]):
                    if b and i<3:
                      pass
                      # actions[i](users_resources[i])
                    elif (not b) and (i < 3):
                        type_rejection = TypeEvent.user_rejected_not_enough_resources
                        msg, reason = "fail", "because not enough resources"
                    elif (not b) and (i == 3):
                        msg, reason = "fail", "because too much time waiting for resources"
                        type_rejection =TypeEvent.user_rejected_not_enough_time

                n_message_generator(Event(self.monitoring, user, self, self.env.now,type_rejection,msg + " " + reason))

    def __str__(self):
        return f"Server {self.id} {self.prop}"

class RegularServer(Server):

    def __init__(self, cpu,mem, hdd, nperiods,x,y,input):
        super().__init__(cpu,mem,hdd, nperiods,'D',x,y,input)

    def run_server(self):
        pass


class VolunteerServer(Server):

    def __init__(self, cpu, mem, hdd, nperiods, p,x,y,input):
        super().__init__(cpu, mem, hdd, nperiods, p,x,y,input)

        self.p_e = 0.99999

        if self.prop == 'H':
            self.t_e = 30
            self.WT = 480
            self.sigma = 30
            self.n = 3
        elif self.prop == 'M':
            self.t_e = 45
            self.WT = 360
            self.sigma = 60
            self.n = 2
        elif self.prop == 'L':
            self.t_e = 60
            self.WT = 240
            self.sigma = 120
            self.n = 1

        self.uT, self.mu = self.input.test.behavour.AT(self,self.WT, self.sigma, self.n, self.t_e)


    def run_server(self):
        self.env.process(self.__running_server_time__())

    def server_behaviour(self):

        P = 1440
        days = 1
        state, state_p, Y, YY = 0, -1, [], []
        probability = []

        # Only for Low servers
        if self.prop == 'L':
            self.uT, self.mu =self.input.test.behavour.AT(self,self.WT, self.sigma, self.n, self.t_e)

        L1a, L2a = self.input.test.behavour.L1L2(self,self.uT, self.mu, self.t_e, self.prop)
        msg = (f"Server:{self.id} LOW W:{self.WT} sigma:{self.sigma} n:{self.n} t_e:{self.t_e} p_e:{self.p_e} uT:{self.uT} mu:{self.mu} L1a:{L1a} L2b:{L2a}")
        n_message_generator(Event(self.monitoring, self, None, self.env.now, TypeEvent.server_information, msg))

        for t in range(P * days):

            pb = self.input.test.behavour.T(t % P, L1a, L2a, self.p_e, self.t_e)
            if self.input.test.behavour.get_random(self).random() < pb:
                state = 1
            else:
                state = 0
            YY.append(state)
            probability.append(pb)

            if state != state_p:
                Y.append(1)
            else:
                Y[-1] += 1
            state_p = state

        return Y


    def __running_server_time__(self):
        # # Each period 1 minute ---> 1 month <=> 1*60*12*30
        # print(self)

        while True:
            day_behaviour = self.server_behaviour()
            if len(day_behaviour) % 2 == 0:
                print("stop")
            for state_duration in day_behaviour:
                yield self.env.timeout(state_duration)
                if self.on:

                    msg = f"Server:{self.id} {self.prop} Turn OFF at {self.env.now}"
                    n_message_generator(Event(self.monitoring, self, None, self.env.now,
                                              TypeEvent.server_information, msg))

                    self.switch_off()
                else:

                    msg = f"Server:{self.id} {self.prop} Turn ON at {self.env.now}"
                    n_message_generator(Event(self.monitoring, self, None, self.env.now,
                                              TypeEvent.server_information, msg))

                    self.switch_on()

            self.switch_off()


    def switch_off(self):

        self.on = False
        for task in self.process_swith_off_list:
            if task.is_alive:
                task.interrupt(cause=f"Server {self.id} is switched off")
        self.process_swith_off_list.clear()
        n_message_generator(Event(self.monitoring,self,self,self.env.now,TypeEvent.server_switched_off,f"server {self.id} switch Off"))
        n_message_generator(Event(self.monitoring, self, self, self.env.now, TypeEvent.server_change_inventary,
                                  f"{0} {0} {0}"))