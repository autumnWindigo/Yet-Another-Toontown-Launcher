package cogDisguise

import (
	ttrapi "YATL/src/ttrAPI"
	"encoding/json"
	"github.com/rs/zerolog/log"
)

//returns a struct containing toon's cog disguise info
func GetCogSuitInfoByDepartment(port int) SuitByDepartment{
	data, err := ttrapi.CallLocalApi(port, ttrapi.CogSuits)
		if err != nil {
			log.Error().
				Err(err).Msg("Failed API call")
		}
	cogSuitInfoByDepartment := SuitByDepartment{}
	err = json.Unmarshal(data, &cogSuitInfoByDepartment)
	if err != nil {
		log.Error().
			Err(err).Msg("Failed to Unmarshal JSON")
	}
	return cogSuitInfoByDepartment
}

var bossbotRewards = map[int]string {
	2097: "Final Fringe",
	882: "First Fairway",
	235: "Five Story",
	153: "Four Story DDL or Brghh",
	135: "Four Story",
	83: "Three Story",
}
var lawbotRewards = map[int]string {
	1854: "Senior Wing",
	781: "Junior Wing", 
	235: "five story",
	153: "Four Story DDL or Brghh",
	135: "four story",
	83: "three story",
}
var cashbotRewards = map[int]string {
	1854: "Bullion Mint",
	781: "Coin Mint",
	235: "Five Story",
	153: "Four Story DDL or Brghh",
	135: "Four Story",
	83: "Three Story",
}
var sellbotRewards = map[int]string {
	1525: "Full Steel",
	867: "Short Steel", 
	350: "Short Scrap",
}
//Appends facility rewards required to an array
func CalcFacilitiesFromRemainder(rewardList []int, current int, remaining int, results *[]int) {
	if remaining % rewardList[current] == remaining {
		if (current + 1 >= len(rewardList) || remaining <= 0 ) {
			*results = append(*results, remaining)
			return
		}
		if (rewardList[current + 1] >= remaining) {
			CalcFacilitiesFromRemainder(rewardList, current + 1, remaining, results)
			return
		}
	}
	newRemaining := remaining - rewardList[current]
	*results = append(*results,rewardList[current])
	CalcFacilitiesFromRemainder(rewardList, current, newRemaining, results)
}

func CalcRemainingExperience(cogSuitInfoByDepartment SuitByDepartment) [4]int {
	bossbotRemainingExperience := cogSuitInfoByDepartment.C.Promotion.Target - cogSuitInfoByDepartment.C.Promotion.Current
	lawbotRemainingExperience := cogSuitInfoByDepartment.L.Promotion.Target - cogSuitInfoByDepartment.L.Promotion.Current
	cashbotRemainingExperience := cogSuitInfoByDepartment.M.Promotion.Target - cogSuitInfoByDepartment.M.Promotion.Current
	sellboRemainingExperience := cogSuitInfoByDepartment.S.Promotion.Target - cogSuitInfoByDepartment.S.Promotion.Current
	return [4]int{bossbotRemainingExperience, lawbotRemainingExperience, cashbotRemainingExperience, sellboRemainingExperience}
}

func CreateFastestDataset(results []int, rewardList map[int]string) map[string]int{
	ret := make(map[string]int)
	
	for _, facilityRewards := range results {
		_, exists := ret[rewardList[facilityRewards]]; if !exists {
			ret[rewardList[facilityRewards]] = 0
		}
		ret[rewardList[facilityRewards]] += 1
	}
	ret["Remaining"] = results[len(results)-1]
	return ret
}

func CalcFastestPromotion(cogSuitInfoByDepartment SuitByDepartment) FastestByDepartment {
	var FastestByDepartment FastestByDepartment	
	var suitType = []string{"boss", "law", "cash", "sell"}

	for i, cogType := range suitType {
		results := []int{}

		Experience := CalcRemainingExperience(cogSuitInfoByDepartment)
		
		switch cogType {
		case "boss":
			CalcFacilitiesFromRemainder(arrayFromCogRewards(bossbotRewards), 0, Experience[i], &results)
			FastestByDepartment.C = CreateFastestDataset(results, bossbotRewards)
		case "law":
			CalcFacilitiesFromRemainder(arrayFromCogRewards(lawbotRewards), 0, Experience[i], &results)
			FastestByDepartment.L = CreateFastestDataset(results, lawbotRewards)
		case "cash":
			CalcFacilitiesFromRemainder(arrayFromCogRewards(cashbotRewards), 0, Experience[i], &results)
			FastestByDepartment.M = CreateFastestDataset(results, cashbotRewards)
		case "sell":
			CalcFacilitiesFromRemainder(arrayFromCogRewards(sellbotRewards), 0, Experience[i], &results)
			FastestByDepartment.S = CreateFastestDataset(results, sellbotRewards)

		}
	}
	
	return FastestByDepartment
}

func arrayFromCogRewards(cogMap map[int]string) []int {
	ret := make([]int, 0)
	for key := range cogMap {
		ret = append(ret, key)
	}
	return ret
}
