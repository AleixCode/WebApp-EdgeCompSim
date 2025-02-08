from sys import exception

import simpy as sim
from nodes import Node
from nodes import generate_random_location
from monitoring import Event, put_trace_users, n_message_generator,TypeEvent

class User(Node):
    ID = 0

    # class dummy
    def __init__(self):
        pass

    def print(self):
        return self.__str__()

    def run_user(self,env,servers):
        self.env = env
        env.process(self.laugh_user(env,servers))

    def laugh_user(self,env,servers):

        yield env.timeout(self.arrival_time-env.now)

        msg =(f"User {self.id}, arrive at {env.now}, but arrival time was {self.arrival_time}, computation time "
            f"{self.comp}, and due time {self.due_time} {self.cpu} {self.mem} {self.hdd}")
        if self.id==2:
            print(msg)
        evnt = Event(self.monitoring, self, None, env.now, TypeEvent.user_arrival,msg)

        # mongoDB
        n_message_generator(evnt)

        while True:

            # TODO: integration with optimization method
            # TODO: geographic issues
            info,server = self.input.placement.get_server(self,self.input.test.place_type)

            if server != None:
                try:
                    task = env.process(server.complete_task(self))
                    server.process_swith_off_list.append(task)
                    yield task
                    if task in server.process_swith_off_list:
                        del server.process_swith_off_list[server.process_swith_off_list.index(task)]

                except sim.exceptions.Interrupt:
                    msg = f"User {self.id} interrupted in server {server.id} at time {env.now}"
                    evnt = Event(self.monitoring,self, server,env.now, TypeEvent.user_interrupted, msg)
                    # mongoDB
                    n_message_generator(evnt)

            else:
                match info:
                    case 1:
                        msg = f"User {self.id} rejected at time {env.now} by all servers off"
                        evnt = Event(self.monitoring, self, server, env.now, TypeEvent.user_rejected_all_servers_off, msg)
                    case 2:
                        msg = f"User {self.id} rejected at time {env.now} by all servers out of area coverage"
                        evnt = Event(self.monitoring, self, server, env.now, TypeEvent.user_rejected_all_servers_out, msg)

                # mongoDB
                n_message_generator(evnt)

            if self.done or self.due_time <= env.now:

                if self.done:
                    # print("User completed")
                    #mongoDB
                    n_message_generator(Event(self.monitoring, self, server, env.now, TypeEvent.user_completed,
                                              f"User {self.id} completed in server {server.id} at {env.now}"))
                    self.monitoring.total_completed += 1
                else:
                    # print("User expired")
                    #mongoDB
                    n_message_generator(Event(self.monitoring, self, server, env.now, TypeEvent.user_expired,
                                              f"User {self.id} expired at {env.now};{self.cpu} {self.mem} {self.hdd}"))
                    self.monitoring.total_expired += 1

                del self.monitoring.users[self.monitoring.users.index(self)]

                return
            else:
                yield env.timeout(self.input.test.behavour.get_random(self).randint(1,3))

    def __str__(self):
        return f"User {self.id} {self.x} {self.y} {self.comp} {self.due_time}"

    def add_data_user(self, time_arrival, due_time, cpu, mem, hdd, comp, x=0, y=0, input=None, placement=None):

        self.id = User.ID
        self.env = None
        self.cpu = cpu
        self.mem = mem
        self.hdd = hdd
        self.comp = comp
        self.arrival_time = time_arrival
        self.due_time = due_time
        self.monitoring = None
        self.done = False
        # self.nearby_servers=[]
        self.placement = placement
        self.resources = {"cpu":self.cpu,"mem":self.mem,"hdd":self.hdd}
        self.input = input

        super().__init__(x, y)

        User.ID += 1


def gen_users(model,max_duration,l_users,district,input):

    # print("gen_users")
    def set_lamda(t):
        t = t % 1440
        for indx,interval in enumerate(input.band_intervals):
            if t in interval:
                return input.users_lambdas[indx]
        return input.users_lambdas[-1]

    while True:

        #create new empty user
        user = User()

        lambda_value = set_lamda(int(model.env.now + 1))

        arrival = int(model.env.now+1)
        # due_time = random.randint(arrival+max_duration,arrival+max_duration*2)
        # duration = random.randint(1,max_duration)
        due_time = input.test.behavour.get_random(user).randint(arrival+max_duration,arrival+max_duration*2)
        duration = int(input.test.behavour.get_random(user).randint(1,max_duration))
        res = []

        t_users = list(range(len(input.users_prob)))
        t_user = input.test.behavour.get_random(user).choices(t_users,input.users_prob)[0]

        resources = input.users_resources[t_user]

        for r in resources:
            res.append(r)

        x,y = generate_random_location(district,input.test.behavour.get_random_n(user))
        user.add_data_user(arrival,due_time,*res,duration,x,y,input=input)
        #print("Time", model.env.now, "users", user.id, "arrival", arrival, "due_time", due_time, "comput", duration, "resources",res)
        user.monitoring = model.monitoring
        user.monitoring.total_jobs += 1

        #mongoDB
        put_trace_users(user)
        user.run_user(model.env,model.servers)

        #Placement
        l_users.append(user)

        #exp = random.expovariate(lambda_value)
        print(lambda_value)
        exp = input.test.behavour.get_random(user).expovariate(lambda_value)
        yield model.env.timeout(exp)