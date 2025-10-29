import React, { useEffect, useState } from "react";
import { GagAttack, StatusName } from "./CalcTypes.ts";
import CogStatusMenu from "./CogStatusMenu.tsx";
import { Box, Button, Drawer, Grid, Group, Image, Slider, Stack, Switch, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GagMenu from "./GagMenu.tsx";
import { CalculateAttacks } from "../../../bindings/YATL/services/calculatorservice.ts"
import { AttackAnalysis } from "../../../bindings/YATL/lib/calculator/models.ts";
import { CatppuccinColors } from "../../themes/CatppuccinMocha.ts";
import CogHealthBar from "./cogHealthBar.tsx";
import AccuracyBar from "./AccuracyBar.tsx";

const Calculator: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [cogLevel, setCogLevel] = useState<string | number>(12);
  const [selectedGags, setSelectedGags] = useState<Array<GagAttack>>([]);
  const [analyzedAttacks, setAnalyzedAttacks] = useState<Array<AttackAnalysis>>([]);
  const [boilerLevel, setBoilerLevel] = useState<number>(1);
  const [finalDamage, setFinalDamage] = useState<number>(0);
  const [tempDamage, setTempDamage] = useState<number>(0);
  const [finalAccuracy, setFinalAccuracy] = useState<number>(0);
  const [tempAccuracy, setTempAccuracy] = useState<number>(0);
  const [isLured, setIsLured] = useState<boolean>(false);


  const [checkedStatuses, setCheckedStatuses] = useState<
    Record<StatusName, boolean>
  >(() => {
    const initState = Object.values(StatusName).reduce((acc, status) => {
      acc[status as StatusName] = false;
      return acc;
    }, {} as Record<StatusName, boolean>);
    return initState;
  });

  useEffect(() => {
    handleCalcGags();
  }, [selectedGags, cogLevel, checkedStatuses, boilerLevel, isLured]);

  const handleCheckedStatus = (status: StatusName) => {
    setCheckedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  useEffect(() => {
    setFinalDamage(() => addDamageNumbers());
    setFinalAccuracy(Number(analyzedAttacks
      .filter(
        (atk, index, self) =>
          self.findIndex((a) => a.Gag.GagType === atk.Gag.GagType) === index
      )
      .reduce((total, atk) => total * atk.FinalAcc * 0.01, 100)
      .toFixed(2)
    ))
  }, [analyzedAttacks])

  const handleAnalyzeAttacks = (attacks: Array<AttackAnalysis>) => {
    setAnalyzedAttacks(() => [...attacks])
  }

  const handleSelectedGag = (gag: GagAttack) => {
    if (selectedGags.length >= 4) {
      clearSelectedGag()
    }

    setSelectedGags((prev) => [...prev, gag])
  };

  const clearSelectedGag = () => {
    setSelectedGags(() => [])
  }

  const removeSelectedGag = (gag: GagAttack) => {
    setSelectedGags((prev) => {
      const index = prev.findIndex((g) => g.Gag.GagName === gag.Gag.GagName && g.IsOrg === gag.IsOrg);
      if (index === -1) return prev;

      const newGags = [...prev]
      newGags.splice(index, 1)
      return newGags
    })
  }

  const handlegagMenuHoverEnd = () => {
    setTempDamage(0);
  };

  const handleGagMenuHover = async (gag: GagAttack) => {
    const tempGags = [...selectedGags, gag];

    const result = await CalculateAttacks(tempGags, isLured, {
      boilerLevel,
      level: Number(cogLevel),
      tier: 8,
      cheats: Object.values(StatusName).filter((status) => checkedStatuses[status])
    });

    const tempTotalDamage = Math.ceil(
      result.reduce(
        (total, atk) => total + atk.BaseDamage + atk.LureDamage + atk.ComboDamage,
        0
      )
    );

    const tempTotalAccuracy = analyzedAttacks
      .filter(
        (atk, index, self) =>
          self.findIndex((a) => a.Gag.GagType === atk.Gag.GagType) === index
      )
      .reduce((total, atk) => total * atk.FinalAcc * 0.01, 100)
      .toFixed(2)

    setTempDamage(tempTotalDamage);
    setTempAccuracy(Number(tempTotalAccuracy));
  };

  const handleCogLevel = (lvl: string | number) => {
    const num = Number(lvl)
    if (!isNaN(num)) {
      setCogLevel(num)
    }
  }

  const addDamageNumbers = () => {
    let totalDamage = 0,
      totalBaseDamage = 0,
      totalLureDamage = 0,
      totalComboDamage = 0

    totalBaseDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.BaseDamage, 0))
    totalLureDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.LureDamage, 0))
    totalComboDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.ComboDamage, 0))

    totalDamage = totalBaseDamage + totalLureDamage + totalComboDamage
    return Math.ceil(totalDamage)
  }

  const handleCalcGags = async () => {
    const result = await CalculateAttacks(selectedGags, isLured, {
      boilerLevel: boilerLevel,
      level: Number(cogLevel),
      tier: 8,
      cheats: Object.values(StatusName).filter((status) => checkedStatuses[status] === true)
    })

    handleAnalyzeAttacks(result)
  }

  const getCogHealthModifier = () => {
    let checked = Object.values(StatusName).filter((status) => checkedStatuses[status] === true)
    let modifier = 0;

    checked.forEach(status => {
      switch (status) {
        case StatusName.OverPaidCoin:
          modifier += 150
          break;
        case StatusName.OverPaidBullion:
          modifier += 200
          break;
      }
    })

    return modifier
  }

  // TODO make images for selected gag display
  return (
    <div>
      <CogHealthBar
        finalDamage={finalDamage}
        cogHealthModifier={getCogHealthModifier()}
        tempDamage={tempDamage}
      />
      <Box p='md'>
        <GagMenu
          onSelectedGags={handleSelectedGag}
          handlegagMenuHover={handleGagMenuHover}
          handlegagMenuHoverEnd={handlegagMenuHoverEnd}
          isLured={isLured}
        />
      </Box>

      <Grid
        className="selected-gags"
        columns={14}
        h={80}
        justify="center"
        align="center"
        p='sm'
      >
        {selectedGags.map((gag, i) => {
          return (
            <Grid.Col span={2} key={i}>
              <Button
                variant="default"
                fullWidth
                h={50}
                radius='md'
                onContextMenu={(e) => {
                  e.preventDefault()
                }}
                onClick={() => removeSelectedGag(gag)}
                style={{
                  background: gag.IsOrg ? CatppuccinColors.Green : CatppuccinColors.Blue,
                  border: 0
                }}
              >
                <Image src={gag.Gag.Resource} height={40} width={40} fit="contain" />
              </Button>
            </Grid.Col>
          )
        })}
      </Grid>

      <Group justify="center">
        <Button variant="default"
          onClick={open}
          onContextMenu={(e) => e.preventDefault()}
          m='sm'
        >
          Cog Settings
        </Button>
        <Button variant="default"
          onContextMenu={(e) => e.preventDefault()}
          m='sm'
        >
          SOS Cards
        </Button>

        <Button variant="default"
          onClick={clearSelectedGag}
          onContextMenu={(e) => e.preventDefault()}
          m='sm'
        >
          Clear Gags
        </Button>
        <Switch
          checked={isLured}
          onChange={(event) => setIsLured(event.currentTarget.checked)}
          label="Start Turn Lured"
        />
      <AccuracyBar
        finalAccuracy={finalAccuracy}
        tempAccuracy={tempAccuracy}
      />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        offset={8}
        radius="md"
      >
        <Stack>
          <Text fw={500}>Cog Level: {cogLevel}</Text>
          <Slider
            value={Number(cogLevel)}
            onChange={handleCogLevel}
            min={1}
            max={20}
            step={1}
            marks={[
              { value: 1, label: "1" },
              { value: 12, label: "12" },
              { value: 20, label: "20" },
            ]}
          />
        </Stack>
        <Box h={25} />
        <CogStatusMenu
          checkedStatuses={checkedStatuses}
          onStatusCheck={handleCheckedStatus}
          setBoilerLevel={setBoilerLevel}
          boilerLevel={boilerLevel}
        />
      </Drawer>
    </div>
  );
};

export default Calculator;
