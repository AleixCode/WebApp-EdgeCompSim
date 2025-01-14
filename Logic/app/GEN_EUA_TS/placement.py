import math
import enum
import numpy as np
from scipy.spatial import KDTree

class TypeError(enum.Enum):

    error_all_servers_off = 1
    error_all_servers_out_coverage = 2

class Placement:

    def __init__(self,test,points,ml,radio):

        self.ml = ml
        self.test = test
        self.radio = radio
        self.k2dtree = KDTree(points)


    def __get_k_nearest_servers__(self,user, k=10):

        point = (user.x,user.y)

        servers = [s for s in self.test.input.servers]
        _,indexes = self.k2dtree.query(point,k)
        if not (type(indexes) is np.ndarray):
            indexes = [indexes]

        # lat1=user.y,lon1=user.x,lant2=server.y,lon2=server.x
        dist = lambda params: math.acos(math.sin(math.radians(user.y))*math.sin(math.radians(params[1]))+
                                        math.cos(math.radians(user.y))*math.cos(math.radians(params[1]))*
                                        math.cos(math.radians(params[0])-math.radians(user.x)))*6371000

        try:
            distances = list(map(dist,[(servers[i].x,servers[i].y) for i in indexes]))
        except Exception as e:
            print(servers)
            print(e)

        servers = [servers[j] for i,j in enumerate(list(indexes)) if distances[i] < self.radio]
        servers = [s for s in servers if s.on]
        if len(servers) != 0:
            #i = self.test.behavour.get_random(user).randint(0, len(servers) - 1)
            return servers[0]
        return None


    def __get_list_k_nearest_servers__(self,user, k=10):

        point = (user.x,user.y)

        servers = [s for s in self.test.input.servers]
        _,indexes = self.k2dtree.query(point,k)
        if not (type(indexes) is np.ndarray):
            indexes = [indexes]

        # lat1=user.y,lon1=user.x,lant2=server.y,lon2=server.x
        dist = lambda params: math.acos(math.sin(math.radians(user.y))*math.sin(math.radians(params[1]))+
                                        math.cos(math.radians(user.y))*math.cos(math.radians(params[1]))*
                                        math.cos(math.radians(params[0])-math.radians(user.x)))*6371000

        try:
            distances = list(map(dist,[(servers[i].x,servers[i].y) for i in indexes]))
        except Exception as e:
            print(servers)
            print(e)

        servers = [servers[j] for i,j in enumerate(list(indexes)) if distances[i] < self.radio]
        servers = [s for s in servers if s.on]
        if len(servers) != 0:
            return servers
        return None

    def __get_nearest_server__(self,user):
        return self.__get_k_nearest_servers__(user, k=1)

    def __filter_servers__(self,user):
        # by distance and on/off

        info = 0
        servers = [s for s in self.test.input.servers if s.on]
        if len(servers)==0:
            return 1,[]

        # lat1=user.y,lon1=user.x,lant2=server.y,lon2=server.x
        dist = lambda params: math.acos(math.sin(math.radians(user.y))*math.sin(math.radians(params[1]))+
                                        math.cos(math.radians(user.y))*math.cos(math.radians(params[1]))*
                                        math.cos(math.radians(params[0])-math.radians(user.x)))*6371000

        distances = list(map(dist,[(server.x,server.y) for server in servers]))
        servers = [s for i,s in enumerate(servers) if distances[i]<=self.radio]

        return info,servers

    def __get_random_server__(self,user):

        info, servers = self.__filter_servers__(user)

        if len(servers)!=0:
            i = self.test.behavour.get_random(user).randint(0,len(servers)-1)
            return info,servers[i]
        return 2,None

    def __check_resources__(self,user,server_id,t):
        for resource in user.resources:
            if user.resources[resource] > self.ml.get_prediction_level(server_id,resource,t):
                return False
        return True

    def __get_ML_server__(self,user):

        current_time = int(user.env.now)
        servers = self.__get_list_k_nearest_servers__(user)

        if servers is not None:
            for server in servers:
                on_off = all([self.ml.get_prediction_on_off(server.id,t_u)>0.9 for t_u in range(current_time+1,current_time+1 + user.comp)])
                if on_off and self.__check_resources__(user,server.id,current_time):
                    return server
        return None

    def get_server(self,user,placement_type):

        info,server = 0,None
        if placement_type == 0:
            info,server = self.__get_random_server__(user)
        elif placement_type == 1:
            info,server = self.__get_nearest_server__(user)
        elif placement_type == 2:
            info,server = self.__get_k_nearest_servers__(user)
        elif placement_type == 3:
            info,server = self.__get_ML_server__(user)

        return info,server