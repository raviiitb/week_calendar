Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root   'home#index'
  post   'event'    , to: 'events#create'
  patch  'event/:id', to: 'events#update' 
  delete 'event/:id', to: 'events#destroy'
end
