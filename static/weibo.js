// Weibo API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}


// 增加一个 weibo
var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}


// 删除一个 weibo
var apiWeiboDelete = function(id,callback) {
    var path = '/api/weibo/delete?id=' + id
    ajax('GET', path, '', callback)
}

// 删除一个 weibo
var apiWeiboFind = function(id,callback) {
    var path = '/api/weibo/find?id=' + id
    ajax('GET', path, '', callback)
}


// 更新一个 weibo
var apiweiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}


// 获取所有 commment
var apiCommentAll = function(id, callback) {
    var path = '/api/comment/all?id=' + id
    ajax('GET', path, '', callback)
}

// 增加一个 comment
var apiCommentAdd = function(form, callback) {
    var path =  '/api/comment/add'
    ajax('POST', path, form, callback)
}


// 删除一个 comment
var apiCommentDelete = function(id,callback) {
    var path = '/api/comment/delete?id=' + id
    ajax('GET', path, '', callback)
}



// Weibo DOM
var weiboTemplate = function(weibo) {
    // data-* 是新增的自定义标签属性的方法
    // data-weibo_id='1'获取属性的方式是 .dataset.weibo_id
    //noinspection JSAnnotator
    var id = weibo.id
    var content = weibo.content
    var t = `
        <div class="weibo-cell" data-weibo_id="${id}">
                <button class="weibo-edit" data-weibo_id="${id}">编辑</button>
                <button class="weibo-delete" data-weibo_id="${id}">删除</button>
                <span class='weibo-content'> ${content}</span>
            <div class="comment-update-form" data-weibo_id="${id}">
                <input class="comment-update-input" data-weibo_id="${id}">
                <button class="comment-update-button" data-weibo_id="${id}">添加评论</button>
            </div>
        </div>
    `
    return t
}


var weiboUpdateFormTemplate = function(weibo) {
    var t = `
      <div class="weibo-update-form">
        <input class="weibo-update-input" value="${weibo.content}">
        <button class="weibo-update">更新</button>
      </div>
    `
    return t
}

// Comment DOM
var commentTemplate = function(comment) {
    // data-* 是新增的自定义标签属性的方法
    // data-id='1'获取属性的方式是 .dataset.id
    //noinspection JSAnnotator
    var id = comment.id
    var content = comment.content
    var t = `
        <div class="comment-cell" data-comment_id="${id}">
            <button class="comment-delete" data-comment_id="${id}">删除评论</button>
            <span class='comment-content' data-comment_id="${id}"> ${content}</span>
        </div>
    `
    return t
}


var insertWeibo = function(weibo) {
    // var task = weibo['task']
    // var task = weibo.task
    var weiboCell = weiboTemplate(weibo)
    log('weiboCell 11', weiboCell)
    // 插入 weibo-list
    var weiboList = e('#weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
    // 老办法，不推荐 weiboList.innerHTML += weiboCell
}


var insertComment = function(comment) {
    // var task = weibo['task']
    // var task = weibo.task
    var id = comment.weibo_id
    var commentList = commentTemplate(comment)
    log('commentList 22', commentList)
    // 插入 comment-list
    var query = `.weibo-cell[data-weibo_id="${id}"]`
    log('comment query 33 ', query)
    var weiboCell = e(query)
    log('weiboCell 44',weiboCell)
    weiboCell.insertAdjacentHTML('beforeend', commentList)
    // 老办法，不推荐 weiboList.innerHTML += weiboCell
}



var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
      // 回调函数，拿到数据准备干什么
        console.log('load all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)

            var weiboId = weibo.id
            log('weiboId 55',weiboId)
            // 调用 ajax api 来载入weiboId下的comments数据
            apiCommentAll(weiboId, function (r) {
                // 解析为 数组
                var comments = JSON.parse(r)
                // 循环添加评论
                for(var j =0; j<comments.length; j++){
                    var comment = comments[j]
                    insertComment(comment)
                }
            })
        }
    })
}


var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        // 制作字典，最终由服务端路由函数处理
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            // r 是返回的 json 字典格式的 weibo
            //
            //
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('#weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        //  我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        //    通过比较被点击元素的 class
        //    来判断元素是否是我们想要的
        //    classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-delete')){
            log('点击到了 删除按钮')
            var weiboId = self.dataset.weibo_id
            // 删除 self 的父节点, 参考  weiboTemplate DOM
            apiWeiboDelete(weiboId, function(r) {
                log('服务器响应删除成功', r)
                self.parentElement.remove()
              })
          }
        })
}


var bindEventWeiboEdit = function() {
    var weiboList = e('#weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log('click event',event)
        //  我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('event.target',self)
        //    通过比较被点击元素的 class
        //    来判断元素是否是我们想要的
        //    classList 属性保存了元素所有的 class
        log('self.parentElement 66', self.parentElement)
        log("self.closest('.weibo-update-form 77')", self.closest('.weibo-update-form'))
        if (self.classList.contains('weibo-edit')){
            var weibo_id = self.dataset.weibo_id
            apiWeiboFind(weibo_id, function (r) {
                var weibo = JSON.parse(r)
                var t = weiboUpdateFormTemplate(weibo)
                self.parentElement.insertAdjacentHTML('afterBegin', t)

            })
            // edit 不需要发送任何数据
            // log('点击到了 删除按钮')
            // var weiboId = self.dataset.weibo_id
            // // 删除 self 的父节点, 参考  weiboTemplate DOM
            // apiWeiboEdit(WeiboId, function(r) {
            //     log('服务器响应编辑成功', r)
            //   })
          }
        })
}


var bindEventWeiboUpdate = function() {
    var weiboList = e('#weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        // log(event)
        //  我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        // closet 最近的
        //
        if (self.classList.contains('weibo-update')){
          var weiboCell = self.closest('.weibo-cell')
          var input = weiboCell.querySelector('.weibo-update-input')
          var id = weiboCell.dataset.weibo_id
          var form = {
                id: id,
                content:input.value
          }
          log('update form', form)
          apiweiboUpdate(form, function(r) {
              log('update', r)
              var updateForm = weiboCell.querySelector('.weibo-update-form')
              updateForm.remove()

              var weibo = JSON.parse(r)
              var content = weiboCell.querySelector('.weibo-content')
              content.innerHTML = weibo.content
          })
        }
        })
}




var bindEventCommentAdd = function() {
    var weiboList = e('#weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        // log(event)
        //  我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        // closet 最近的
        //
        if (self.classList.contains('comment-update-button')){
          var commentForm = self.closest('.comment-update-form')
          var input = commentForm.querySelector('.comment-update-input')
          var id = commentForm.dataset.weibo_id
          var form = {
                weibo_id: id,
                content: input.value
          }
          log('update form', form)
          apiCommentAdd(form, function(r) {
              log('add comment', r)
              var comment = JSON.parse(r)
              insertComment(comment)
          })
        }
        })
}


var bindEventCommmentDelete = function() {
    var weiboList = e('#weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        //  我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        //    通过比较被点击元素的 class
        //    来判断元素是否是我们想要的
        //    classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('comment-delete')){
            log('点击到了 删除按钮')
            var commentId = self.dataset.comment_id
            // 删除 self 的父节点, 参考  weiboTemplate DOM
            apiCommentDelete(commentId, function(r) {
                log('服务器响应删除成功', r)
                self.parentElement.remove()
              })
          }
        })
}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommmentDelete()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()