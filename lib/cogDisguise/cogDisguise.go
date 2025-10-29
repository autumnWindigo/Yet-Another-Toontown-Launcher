package cogDisguise

import (
	ttrapi "YATL/lib/ttrAPI"
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

//TODO
//Figure out average values for cog building rewards 100, 200, 300 placeholder value estimates for now
var bossbotRewards = [...]int {2097, 882, 300, 200, 100}
var lawbotRewards = [...]int {1854, 781, 300, 200, 100}
var cashbotRewards = [...]int {1626, 702, 300, 200, 100}
var sellbotRewards = [...]int {1525, 867, 596, 350, 300, 200, 100}

//Appends facility rewards required to an array
//ie cashbot 2 bullion and 3 story building would append [1626, 1626, 300]
func CalcFacilitiesFromRemainder(array []int, current int, remaining int, results *[]int) {
	if remaining % array[current] == remaining {
		if current + 1 >= len(array) {
			*results = append(*results, remaining)
			return
		}
		CalcFacilitiesFromRemainder(array, current + 1, remaining, results)
		return
	}
	newRemaining := remaining % array[current]
	*results = append(*results,array[current])
	CalcFacilitiesFromRemainder(array, current, newRemaining, results)
}

func CalcRemainingExperience(cogSuitInfoByDepartment SuitByDepartment) [4]int {
	bossbotRemainingExperience := cogSuitInfoByDepartment.C.Promotion.Target - cogSuitInfoByDepartment.C.Promotion.Current
	lawbotRemainingExperience := cogSuitInfoByDepartment.L.Promotion.Target - cogSuitInfoByDepartment.L.Promotion.Current
	cashbotRemainingExperience := cogSuitInfoByDepartment.M.Promotion.Target - cogSuitInfoByDepartment.M.Promotion.Current
	sellboRemainingExperience := cogSuitInfoByDepartment.S.Promotion.Target - cogSuitInfoByDepartment.S.Promotion.Current
	return [4]int{bossbotRemainingExperience, lawbotRemainingExperience, cashbotRemainingExperience, sellboRemainingExperience}
}

//FIX
//TODO transfer data from Results arrary to Fastest Struct so it can be returned
func TransferResultsDataToFastestStruct(results []int, rewardList []int, Fastest *Fastest) {
	occurrences := make([]int, 7)
	for _, val := range rewardList {
		count := 0
		for _, result := range results{
			if val == result {
				count = count + 1
			}
		}
		occurrences = append(occurrences, count)
	}

	if len(rewardList) == 7 {
		Fastest.Facility.HardFull 	= occurrences[0]
		Fastest.Facility.HardMinimal 	= occurrences[1]
		Fastest.Facility.EasyFull	= occurrences[2]
		Fastest.Facility.EasyMinimal	= occurrences[3]
		Fastest.Building.FiveStory 	= occurrences[4]
		Fastest.Building.FourStory	= occurrences[5]
		Fastest.Building.ThreeStory 	= occurrences[6]
	}

	Fastest.Facility.HardFull 	= occurrences[0]
	Fastest.Facility.EasyFull	= occurrences[1]
	Fastest.Building.FiveStory	= occurrences[2]
	Fastest.Building.FourStory	= occurrences[3]
	Fastest.Building.ThreeStory	= occurrences[4]
}

func CalcFastestPromotion(cogSuitInfoByDepartment SuitByDepartment) (FastestByDepartment, SuitByDepartment){
	var FastestByDepartment FastestByDepartment

	bossbotResults := []int {}
	lawbotResults :=  []int {}
	cashbotResults := []int {}
	sellbotResults := []int {}

	var bossbotFastest = Fastest{}
	var lawbotFastest  = Fastest{}
	var cashbotFastest = Fastest{}
	var sellbotFastest = Fastest{}
	
	Experience := CalcRemainingExperience(cogSuitInfoByDepartment)

	CalcFacilitiesFromRemainder(bossbotRewards[:], 0, Experience[0], &bossbotResults)
	CalcFacilitiesFromRemainder(lawbotRewards[:], 0, Experience[1], &lawbotResults)
	CalcFacilitiesFromRemainder(cashbotRewards[:], 0, Experience[2], &cashbotResults)
	CalcFacilitiesFromRemainder(sellbotRewards[:], 0, Experience[3], &sellbotResults)
//FIX
	TransferResultsDataToFastestStruct(bossbotResults, bossbotRewards[:], &bossbotFastest)
	TransferResultsDataToFastestStruct(lawbotResults, lawbotRewards[:], &lawbotFastest)
	TransferResultsDataToFastestStruct(cashbotResults, cashbotRewards[:], &cashbotFastest)
	TransferResultsDataToFastestStruct(sellbotResults, sellbotRewards[:], &sellbotFastest)

	FastestByDepartment.C = bossbotFastest
	FastestByDepartment.L = lawbotFastest
	FastestByDepartment.M = cashbotFastest
	FastestByDepartment.S = sellbotFastest
	
	return FastestByDepartment, cogSuitInfoByDepartment
}
