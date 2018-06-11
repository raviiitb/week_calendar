import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'

document.addEventListener('DOMContentLoaded', () => {
  var vm = new Vue({
    el: '#events',
    data: {
      current_week_events: [],
      errors: {},
      week_array: [],
      showCreateModal: false,
      showEditDeleteModal: false
    },
    mounted: function() {
      var that = this
      $.ajax({
        url: '/',
        dataType: 'json',
        success: function(res) {
          that.current_week_events = res.events;
          that.week_array = res.week_array;
        },
        error: function(res) {
          that.errors = res.responseJSON.errors
        }
      })
    },
    methods: {
      openCreateForm: function(date) {
        this.showCreateModal = true
        this.selectedDate = date
      },
      getCurrentEventParams: function(task) {
        this.eventId = task.id
        this.event = task
        this.showEditDeleteModal = true
        this.currentEventDate = task.date
        var localStart = new Date(task.start_time)
        this.currentEventStartTime = localStart.toTimeString().substr(0,5)
        var localEnd = new Date(task.end_time)
        this.currentEventEndTime = localEnd.toTimeString().substr(0,5)
      }
    },
    components: {
      'create-form': {
        props: {
          current_week_events: Object,
          errors: Object,
          selectedDate: String,
          date: String
        },
        data: function () {
          return {
            startTime: '',
            endTime: ''
          }
        },
        template: '#create-template',
        methods: {
          saveEvent: function() {
            var that = this
            $.ajax({
              url: '/event.json',
              method: 'POST',
              data: {
                date: this.date,
                start_time: this.startTime,
                end_time: this.endTime
              },
              success: function(res) {
                that.current_week_events[that.date].push(res.event)
                that.$emit('close')
              },
              error: function(res) {
                that.errors = res.responseJSON.errors
              }
            })
          }
        }
      },
      'edit-delete-form': {
        props: {
          current_week_events: Object,
          errors: Object,
          startTime: String,
          endTime: String,
          date: String,
          eventId: Number,
          event: Object
        },
        template: '#edit-delete-template',
        methods: {
          editEvent: function() {
            var that = this
            $.ajax({
              url: '/event/' + that.eventId + '.json',
              method: 'PATCH',
              data: {
                date: this.date,
                start_time: this.startTime,
                end_time: this.endTime            
              },
              success: function(res) {
                that.current_week_events[that.date].push(res.event)
                var index = that.current_week_events[that.date].indexOf(that.event)
                that.current_week_events[that.event.date].splice(index, 1)
                that.$emit('close')
              },
              error: function(res) {
                that.errors = res.responseJSON.errors
              }
            })
          },
          deleteEvent: function() {
            var that = this
            $.ajax({
              url: '/event/' + that.eventId + '.json',
              method: 'DELETE',
              success: function(res) {
                var index = that.current_week_events[that.date].indexOf(that.event)
                that.current_week_events[that.date].splice(index, 1)
                that.$emit('close')
              },
              error: function(res) {
                that.errors = res.responseJSON.errors
              }
            })
          }
        }
      }
    }
  });
})