package main

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	Port 				string `mapstructure:"PORT"`
	ConnectionString	string `mapstructure:"CONNECTION_STRING"`
}

var AppConfig *Config

func LoadAppConfig() {
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.SetConfigType("json")

	err := viper.ReadInConfig()

	if err != nil {
		log.Fatal(err)
	}

	err = viper.Unmarshal(&AppConfig)
	if err != nil {
		log.Fatal(err)
	}
}