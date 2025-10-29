package services

import (
	"YATL/lib/cogDisguise"
)

type CogDisguise struct{}

func (g *CogDisguise) GetCogsuitInfo(port int) (cogDisguise.FastestByDepartment, cogDisguise.SuitByDepartment) {
	suitInfo := cogDisguise.GetCogSuitInfoByDepartment(port)
	return cogDisguise.CalcFastestPromotion(suitInfo)
}

