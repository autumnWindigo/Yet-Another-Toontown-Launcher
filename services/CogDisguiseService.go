package services

import (
	"YATL/src/cogDisguise"
)

type CogDisguiseService struct{}

func (g *CogDisguiseService) GetCogsuitInfo(port int) (cogDisguise.FastestByDepartment, cogDisguise.SuitByDepartment) {
	suitInfo := cogDisguise.GetCogSuitInfoByDepartment(port)
	return cogDisguise.CalcFastestPromotion(suitInfo), suitInfo
}

