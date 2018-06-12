# frozen_string_literal: true

class Event < ApplicationRecord
  validates :date, :start_time, :end_time, presence: true
end
