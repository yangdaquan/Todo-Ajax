import time

from models import Model
from utils import formatted_time, log


class Todo(Model):
    """
    针对我们的数据 TODO
    我们要做 4 件事情
    C create 创建数据
    R read 读取数据
    U update 更新数据
    D delete 删除数据

    Todo.new() 来创建一个 todo
    """

    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'task',
            'user_id',
            'created_time',
            'updated_time',
        ]
        return names

    @classmethod
    def new(cls, form):
        m = super().new(form)
        t = int(time.time())
        m.created_time = t
        m.updated_time = t
        m.save()
        return m

    @classmethod
    def update(cls, id, form):
        m = super().update(id, form)
        log('todo update', m)
        m.updated_time = int(time.time())
        m.save()
        return m

    def is_owner(self, id):
        return self.user_id == id

    def formatted_created_time(self):
        return formatted_time(self.created_time)

    def formatted_updated_time(self):
        return formatted_time(self.updated_time)
