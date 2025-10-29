package cogDisguise

//structs used to hold json from ttr api call for cog disguise information
type CogSuit struct {
	Department 	string 		`json:"department"`
	HasDisguise 	bool  		`json:"hasDisguise"`	
	Suit 		Suit 		`json:"suit"`
	Version 	int	 	`json:"version"`
	Level 		int	 	`json:"level"`
	Promotion 	Promotion	`json:"promotion"`
}

type Promotion struct {
	Current int 	`json:"current"`
	Target	int	`json:"target"`
}

type Suit struct {
	Id string	`json:"id"`
	Name string	`json:"name"`
}

type SuitByDepartment struct {
	C CogSuit	`json:"c"`
	L CogSuit	`json:"l"`
	M CogSuit	`json:"M"`
	S CogSuit	`json:"S"`
}

//struct to hold what facilities and or building combo to do
type Fastest struct {
	Building 	Building
	Facility 	Facility
}

type Building struct {
	ThreeStory int
	FourStory  int
	FiveStory  int
}

type Facility struct {
	EasyMinimal	int
	EasyFull	int
	HardMinimal	int
	HardFull	int
}

type FastestByDepartment struct {
	C Fastest 
	L Fastest
	M Fastest
	S Fastest
}
/*
type cogDisInfo struct {
	C struct {
		Department  string `json:"department"`
		HasDisguise bool   `json:"hasDisguise"`
		Suit        struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"suit"`
		Version   int `json:"version"`
		Level     int `json:"level"`
		Promotion struct {
			Current int `json:"current"`
			Target  int `json:"target"`
		} `json:"promotion"`
	} `json:"c"`
*/
