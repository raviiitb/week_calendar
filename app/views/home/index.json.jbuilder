# frozen_string_literal: true

json.week_array @week_array

json.set! :events do
  @current_week_events.each do |date, events|
    json.set! date, events do |event|
      json.id         event.id
      json.date       event.date
      json.start_time event.start_time
      json.end_time   event.end_time
    end
  end
end
