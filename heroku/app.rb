#!/usr/bin/ruby
require 'rubygems'
require 'sinatra/lib/sinatra'
require 'nokogiri'
require 'json'
require 'open-uri'
require 'mechanize'

get '/auth' do
  begin
    s = WWW::Mechanize.new
    resp = s.post("http://www.instapaper.com/user/login", {:username => params[:user], :password => params[:pass]})
    if resp.body.include?("that's not right.")
      return "login-fail"
    end
    "login-ok," + s.get("http://www.instapaper.com/u").search("#rss a")[0]['href']
  rescue Exception
    "error"
    puts $!.message
  end
end

get '/unreads' do
  doc = Nokogiri(open("http://www.instapaper.com/rss/#{params[:feed]}").read)
  items = doc.css("item").map { |e|
    {
      :title => e.css('title').first.content,
      :link => e.css('link').first.content,
      :guid => e.css('guid').first.content
    }
  }
  
  {
    :count => items.size,
    :items => items
  }.to_json
end
