var Event = new Vue();

//var alert-sound = document.getElementById('alert-sound');  添加音频文件后恢复这条注释呀！！！

Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
        action: function(name, params) {
            Event.$emit(name, params);
        }
    }
})

var main = new Vue({
    el: '#main',
    data: {
        list: [],   //用来存放任务列表的数组
        last_id: 0,
        current: {
            /*title: '...',
            completed: false,
            desc: '...',
            remind_at: '...'*/
        }
    },

    mounted: function() {
        var me = this;
        this.list = ms.get('list') || this.list;
        this.last_id = ms.get('last_id') || this.last_id;
        setInterval(function() {
            me.check_alerts();
        }, 1000);
        Event.$on('remove', function(id) {
            if (id) {
                me.remove(id);
            }
        });
        Event.$on('toggle_complete', function(id) {
            if (id) {
                me.toggle_complete(id);
            }
        });
        Event.$on('set_current', function(id) {
            if (id) {
                me.set_current(id);
            }
        });
        Event.$on('toggle_detail', function(id) {
            if (id) {
                me.toggle_detail(id);
            }
        });
    },

    methods: {
        // 添加和更新清单
        merge: function(){
            var is_update, id;
            is_update = id = this.current.id;  //查看当前项是否有id
            if (is_update) {   //存在id就是更新
                var index = this.find_index(id);
                Vue.set(this.list, index, Object.assign({}, this.current));
                //console.log(this.list);

            } else {           //不存在id就是添加
                var title = this.current.title;  //取出输入的内容
                if(!title && title !== 0) return;  //判断内容是否为空
                var todo = Object.assign({}, this.current);  //合并每次输入的对象，拷贝成一个对象，加入到数组中
                this.last_id++;
                ms.set('last_id', this.last_id);
                todo.id = this.last_id;
                this.list.push(todo);
            }
            this.reset_current();
            
        },

        // 删除清单
        remove: function(id){
            var index = this.find_index(id);
            this.list.splice(index, 1);
        },

        //查看详情
        toggle_detail: function(id) {
            var index = this.find_index(id);
            Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail);
        },


       set_current: function(todo){
            this.current = Object.assign({},todo);
            //copy(todo);
        },

        reset_current: function() {
            this.set_current({});
        },
        
        find_index: function(id) {   //通过id找索引 
            return this.list.findIndex(function(item) {
                return item.id == id;
            });
        },

        toggle_complete: function(id) {
            var i = this.find_index(id);
            Vue.set(this.list[i], 'completed', !this.list[i].completed);
        },

        check_alerts: function() {
            var me = this;
            this.list.forEach(function(row, i) {
                if(!row.alert_at || row.alert_confirmed) return;
                var alert_at = new Date(row.alert_at);
                alert_at.getTime();    //获得需要提醒时的时间戳
                var now = (new Date()).getTime();  //获得当前时间的时间戳

                if (now >= alert_at) {
                    // alert-sound.play();     添加音频文件后恢复这条注释呀呀呀！！！
                    var confirmed = confirm(row.title);
                    Vue.set(me.list[i], 'alert_confirmed', confirmed);
                }
            })
        }
        
    },

    watch: {
            list: {
                deep: true,
                handler: function(n, o) {
                    if (n) {
                        ms.set('list', n);
                    } else {
                        ms.set('list',[]);
                    }
                }
            }
        }

});