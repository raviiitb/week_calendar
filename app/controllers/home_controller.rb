# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    @week_start_date = Date.today.beginning_of_week
    week_end_date = Date.today.end_of_week
    @current_week_events = Event.where(date: @week_start_date..week_end_date).group_by(&:date)
    @week_array = (@week_start_date..week_end_date).to_a
    @week_array.each { |day| @current_week_events[day] ||= nil }
  end
end
