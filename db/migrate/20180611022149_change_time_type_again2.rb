class ChangeTimeTypeAgain2 < ActiveRecord::Migration[5.2]
  def change
  	change_column :events, :start_time, :time
  	change_column :events, :end_time, :time
  end
end
