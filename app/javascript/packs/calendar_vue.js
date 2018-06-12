import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'
Vue.config.silent = true

document.addEventListener('DOMContentLoaded', () => {
  var vm = new Vue({
    el: '#events',
    data: {
      currentWeekEvents: [],
      errors: {},
      weekArray: [],
      showCreateModal: false,
      showEditDeleteModal: false
    },
    mounted: function() {
      var that = this
      $.ajax({
        url: '/',
        dataType: 'json',
        success: function(res) {
          that.currentWeekEvents = res.events;
          that.weekArray = res.week_array;
        },
        error: function(res) {
          that.errors = res.responseJSON.errors
        }
      })
    },
    /////////////// Vue instance methods //////////////////////////////////////////////////////////
    methods: {

      // Fetch all the params to create an event and Opens Create form
      openCreateForm: function(date) {
        this.showCreateModal = true
        this.selectedDate = date
        this.maxDate = this.weekArray[6]
        this.minDate = this.weekArray[0]
      },
      // Fetch all the params of the event to be changed and opens Edit/Delete form
      getCurrentEventParams: function(task) {
        this.event = task
        this.eventId = task.id
        this.showEditDeleteModal = true
        this.currentEventDate = task.date
        var localStart = new Date(task.start_time)
        this.startTime = localStart.toTimeString().substr(0,5)
        var localEnd = new Date(task.end_time)
        this.endTime = localEnd.toTimeString().substr(0,5)
        this.maxDate = this.weekArray[6]
        this.minDate = this.weekArray[0]
      }
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /////////////// Vue Components/////////////////////////////////////////////////////////////////
    components: {
      'create-form': {
        props: {
          currentWeekEvents: Object,
          errors: Object,
          selectedDate: String,
          date: String,
          maxDate: String,
          minDate: String
        },
        data: function () {
          return {
            startTime: '',
            endTime: ''
          }
        },
        template: '#create-template',
        methods: {
          ///////////// Create an event ////////////
          saveEvent: function() {
            var that = this
            $.ajax({
              url: '/events.json',
              method: 'POST',
              data: {
                date: this.date,
                start_time: this.startTime,
                end_time: this.endTime
              },
              success: function(res) {
                that.currentWeekEvents[that.date].push(res.event)
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
          currentWeekEvents: Object,
          errors: Object,
          startTime: String,
          endTime: String,
          date: String,
          maxDate: String,
          minDate: String,
          eventId: Number,
          event: Object
        },
        template: '#edit-delete-template',
        methods: {
          ///////////// Edit an event ////////////
          editEvent: function() {
            var eventPreviousLocalStartTime = new Date(this.event.start_time)
            var eventPreviousParsedStartTime = eventPreviousLocalStartTime.toTimeString().substr(0,5)
            var eventPreviousLocalEndTime = new Date(this.event.end_time)
            var eventPreviousParsedEndTime = eventPreviousLocalEndTime.toTimeString().substr(0,5)
            // Avoid calling ajax call when update params are same.
            if (!( (this.event.date == this.date) &&
                   (this.startTime == eventPreviousParsedStartTime) &&
                   (this.endTime == eventPreviousParsedEndTime)
               ) ) {
              var that = this
              $.ajax({
                url: '/events/' + that.eventId + '.json',
                method: 'PATCH',
                data: {
                  date: this.date,
                  start_time: this.startTime,
                  end_time: this.endTime
                },
                success: function(res) {
                  var index = that.currentWeekEvents[that.event.date].indexOf(that.event)
                  if (that.event.date == that.date) {
                    that.currentWeekEvents[that.date].splice(index, 1, res.event)
                  }
                  else {
                    that.currentWeekEvents[that.date].push(res.event)
                    that.currentWeekEvents[that.event.date].splice(index, 1)
                  }
                  that.$emit('close')
                },
                error: function(res) {
                  that.errors = res.responseJSON.errors
                }
              })
            }
            this.$emit('close')
          },
          ///////////// Delete an event ////////////
          deleteEvent: function() {
            var that = this
            $.ajax({
              url: '/events/' + that.eventId + '.json',
              method: 'DELETE',
              success: function(res) {
                var index = that.currentWeekEvents[that.date].indexOf(that.event)
                that.currentWeekEvents[that.date].splice(index, 1)
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
  })
})
