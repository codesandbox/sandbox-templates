defmodule StarterAppTest do
  use ExUnit.Case
  doctest StarterApp

  test "greets the world" do
    assert StarterApp.hello() == :world
  end
end
