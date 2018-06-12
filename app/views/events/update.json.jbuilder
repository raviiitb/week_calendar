# frozen_string_literal: true

json.event do
  json.id @event.id
  json.date       @event.date
  json.start_time @event.start_time
  json.end_time   @event.end_time
end
