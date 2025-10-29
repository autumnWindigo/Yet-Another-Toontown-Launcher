import { Box } from "@mantine/core";
import React from "react";
import { CatppuccinColors } from "../../themes/CatppuccinMocha";
import { CogHealthBarProps } from "./CalcTypes";

const CogHealthBar: React.FC<CogHealthBarProps> = ({ finalDamage, cogHealthModifier, tempDamage }) => {
  const levelValues: number[] = [
    6,
    12,
    20,
    30,
    42,
    56,
    72,
    90,
    110,
    132,
    156,
    196,
    224,
    254,
    286,
    320,
    356,
    394,
    434,
    476
  ];

  const levels = Array.from(levelValues, (health, i) => ({
    level: i + 1,
    remainingHealth: (health + cogHealthModifier) - finalDamage,
    remainingTempHealth: (health + cogHealthModifier) - tempDamage
  }));

  const getHealthStage = (defeated: boolean, tempDefeated: boolean) => {
    if (defeated) return CatppuccinColors.Green
    if (tempDefeated) return CatppuccinColors.Peach
    return CatppuccinColors.Red
  }

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: "#1c1c1c",
        borderRadius: 10,
        border: "solid 1px",
        borderColor: "#4c4c4c",
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
      }}
    >
      {levels.map((lvl) => {
        const defeated = lvl.remainingHealth <= 0;
        const tempDefeated = lvl.remainingHealth > 0 && lvl.remainingTempHealth <= 0

        return (
          <Box
            style={{
              width: '4%',
              backgroundColor: getHealthStage(defeated, tempDefeated),
              borderRadius: 8,
            }}
          >
            <div style={{
              fontSize: 25,
              fontWeight: 600,
              color: CatppuccinColors.Mantle
            }}>
              {`${lvl.level}`}
            </div>
            <div style={{ color: CatppuccinColors.Mantle }}>
              {`${tempDamage === 0 ? lvl.remainingHealth : lvl.remainingTempHealth}`}
            </div>
          </Box>
        );
      })}
    </Box>
  )
}

export default CogHealthBar;
