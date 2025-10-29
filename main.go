package main

import (
	"YATL/lib/config"
	"YATL/lib/logger"
	"YATL/services"
	"math/rand/v2"
	"os"

	"embed"
	"fmt"

	"github.com/rs/zerolog/log"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Init logger
	logErr := logger.InitLogger()
	if logErr != nil {
		fmt.Println("Could not init Logger: ", logErr)
	}

	// Init Config
	configErr := config.InitViper()
	if configErr != nil {
		log.Error().Err(configErr).Msg("Could not init viper")
	}

	// Generate random auth header for session
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	AuthHeader := make([]byte, len(letters))
	for i := range letters {
		AuthHeader[i] = letters[rand.IntN(len(letters))]
	}
	os.Setenv("TTR_AUTH_HEADER", string(AuthHeader))

	// Create an instance of your app structure
	app := application.New(application.Options{
		Name: "YATL",
		Description: "Yet Another Toontown Launcher",
		Services: []application.Service{
			application.NewService(&services.LoginService{}),
			application.NewService(&services.CalculatorService{}),
			application.NewService(&services.CogDisguise{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "YATL",
		URL: "/",
		DisableResize: true,
		Width: 1280,
		Height: 720,
	})

	err := app.Run()

	if err != nil {
		fmt.Println(err)
	}
}
