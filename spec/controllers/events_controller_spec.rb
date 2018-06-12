# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EventsController, type: :controller do
  describe 'create' do
    let!(:initial_count) { Event.count }
    it 'should return 200 status' do
      params = { date: '2018-06-13', start_time: '03:30', end_time: '04:00' }
      post :create, params: params, format: :json
      expect(response.status).to eq 200
      expect(Event.count).to eq initial_count + 1
      expect(response).to render_template('events/create')
      parsed_response = JSON.parse response.body
      expect(parsed_response).to include('event')
      expect(parsed_response['event']).to include('date', 'id', 'start_time', 'end_time')
      expect(Event.last.date).to eq DateTime.parse('2018-06-13')
    end

    it 'should fail' do
      expect { post :create, params: { end_time: '01:00' }, format: :json }
        .to raise_error ActionController::ParameterMissing
      expect(Event.count).to eq initial_count
    end
  end

  describe 'update' do
    let!(:event) { Event.create(start_time: DateTime.new(2018), end_time: DateTime.new(2018), date: Date.today) }
    it 'should return 200 status' do
      params = { date: '2018-06-13', start_time: '03:30', end_time: '04:00', id: event.id }
      patch :update, params: params, format: :json
      expect(response.status).to eq 200
      expect(response).to render_template('events/update')
      parsed_response = JSON.parse response.body
      expect(parsed_response).to include('event')
      expect(parsed_response['event']).to include('date', 'id', 'start_time', 'end_time')
      expect(Event.find(event.id).date).to eq Date.parse '2018-06-13'
    end

    it 'should return 404 status' do
      params = { date: '2018-06-13', start_time: '03:30', end_time: '04:00', id: 0 }
      patch :update, params: params, format: :json
      expect(response.status).to eq 404
      expect(JSON.parse(response.body)).to eq ({ 'errors' => 'Record not found' })
      expect(Event.find(event.id).date).to eq event.date
    end
  end

  describe 'destroy' do
    let!(:event) { Event.create(start_time: DateTime.new(2018), end_time: DateTime.new(2018), date: Date.today) }
    let!(:initial_count) { Event.count }
    it 'should return 200 status' do
      params = { id: event.id }
      delete :destroy, params: params, format: :json
      expect(response.status).to eq 204
      expect(Event.count).to eq initial_count - 1
    end

    it 'should return 404 status' do
      params = { id: 0 }
      delete :destroy, params: params, format: :json
      expect(response.status).to eq 404
      expect(JSON.parse(response.body)).to eq ({ 'errors' => 'Record not found' })
      expect(Event.count).to eq initial_count
    end
  end
end
