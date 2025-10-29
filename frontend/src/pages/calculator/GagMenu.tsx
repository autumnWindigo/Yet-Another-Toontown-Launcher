import React from "react";
import gagsData from "../../data/gags.json" with {type: "json"}
import { Gag, GagMenuProps } from "./CalcTypes.ts";
import { Box, Button, Grid, Image } from "@mantine/core";
import { CatppuccinColors } from "../../themes/CatppuccinMocha.ts"
import classes from "./calculator.module.css"

const GagMenu: React.FC<GagMenuProps> = ({ onSelectedGags, handlegagMenuHoverEnd, handlegagMenuHover, isLured }) => {
  const gags: Gag[] = gagsData
  const rowColors = [
    CatppuccinColors.Yellow,
    CatppuccinColors.Green,
    CatppuccinColors.Blue,
    CatppuccinColors.Peach,
    CatppuccinColors.Mauve,
    CatppuccinColors.Sky];
  let colorCounter = -1


  return (
    <Box p='lg'
      style={{
        borderRadius: 10,
        backgroundColor: "#1c1c1c",
        border: "solid 1px",
        borderColor: "#4c4c4c",
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
      }}
    >
      <Grid columns={14} gutter={0}>
        {gags.slice(7).map((gag, i) => {
          if (i % 7 == 0) {
            colorCounter++
          }
          // Disable trap gags if starting turn lured
          const disabled = isLured && i < 7;
          return (
            <Grid.Col span={2} key={i}>
              <Box h={50} m={5}>
                <Button
                  className={classes.button}
                  variant="subtle"
                  fullWidth
                  h='100%'
                  disabled={disabled}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onSelectedGags({ Gag: gags[i + 7], IsOrg: true })
                  }}
                  onClick={() => !disabled && onSelectedGags({ Gag: gags[i + 7], IsOrg: false })}
                  onMouseEnter={() => !disabled && handlegagMenuHover({ Gag: gag, IsOrg: false })}
                  onMouseLeave={handlegagMenuHoverEnd}
                  style={{
                    borderWidth: 0,
                    background: disabled ? CatppuccinColors.Subtext1 : rowColors[colorCounter],
                  }}
                >
                  <Image src={gag.Resource} height={40} width={40} fit="contain" />
                </Button>
              </Box>
            </Grid.Col>
          )
        })}
      </Grid>
    </Box>
  );
};

export default GagMenu;
