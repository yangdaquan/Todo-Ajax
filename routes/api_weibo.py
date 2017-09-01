from models.comment import Comment
from routes import json_response
from routes import current_user
from models.weibo import Weibo
from utils import log

# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    # todo_list = Todo.all()
    # 要转换为 dict 格式才行
    # todos = [t.json() for t in todo_list]
    weibos = Weibo.all_json()
    # json_response函数返回 json 格式的 body 数据
    return json_response(weibos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    # 把 body 中的 json 格式字符串解析成 dict 或者 list 并返回
    form = request.json()
    # 创建一个 weibo
    w = Weibo.new(form)
    # 再把创建好的 weibo字典 返回给浏览器
    return json_response(w.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.delete(weibo_id)
    return json_response(w.json())


def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    w = Weibo.update(weibo_id, form)
    return json_response(w.json())


def comment_all(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.find(weibo_id)
    comments = w.comments()
    cs = [c.json() for c in comments]
    return json_response(cs)


def comment_add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    # 把 body 中的 json 格式字符串解析成 dict 或者 list 并返回
    form = request.json()
    # 创建一个 comment
    c = Comment.new(form)
    # 再把创建好的 comment字典 返回给浏览器
    return json_response(c.json())

def comment_delete(request):
    comment_id = int(request.query.get('id'))
    c = Comment.delete(comment_id)
    return json_response(c.json())



def find(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.find(weibo_id)
    return json_response(w.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/weibo/find': find,
        '/api/comment/all': comment_all,
        '/api/comment/add': comment_add,
        '/api/comment/delete': comment_delete,
    }
    return d