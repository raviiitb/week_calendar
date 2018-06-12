# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  describe 'index' do
    it 'should return 200 status' do
      get :index, format: :json
      expect(response.status).to eq 200
      expect(response).to render_template('home/index')
      expect(JSON.parse(response.body)).to include('week_array', 'events')
    end
  end
end
