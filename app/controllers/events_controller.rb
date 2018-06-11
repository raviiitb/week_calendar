class EventsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    @event = Event.new build_params(create_params)
    render json: { errors: @event.errors.messages }, status: 422 unless @event.save
  end

  def update
    @event = Event.find params[:id]
    render json: { errors: @event.errors.messages }, status: 422 unless @event.update(build_params create_params)
  end

  def destroy
    @event = Event.find params[:id]
    if @event.destroy
      head :no_content
    else
      render json: { errors: @event.errors.messages }, status: 422
    end
  end

  private

  def create_params
    params.permit %w[date start_time end_time]
  end

  def update_params
    params.permit %w[date start_time end_time]
  end

  def build_params(params)
    start_time = merge_date_time params[:date], params[:start_time]
    end_time = merge_date_time params[:date], params[:end_time]
    params.merge!({start_time: start_time, end_time: end_time })
  end

  def merge_date_time(date, time)
    year, month, date = date.split('-').map(&:to_i)
    hour, minute  = time.split(':').map(&:to_i)
    DateTime.new year, month, date, hour, minute, 0, Time.now.formatted_offset
  end
end