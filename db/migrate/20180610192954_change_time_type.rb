# frozen_string_literal: true

class ChangeTimeType < ActiveRecord::Migration[5.2]
  def change
    change_column :events, :start_time, :time
    change_column :events, :end_time, :time
  end
end
