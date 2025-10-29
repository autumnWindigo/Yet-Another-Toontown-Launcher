import { Box, RingProgress, Text } from "@mantine/core";
import { AccuracyBarProps } from "./CalcTypes";
import { CatppuccinColors } from "../../themes/CatppuccinMocha";

const AccuracyBar: React.FC<AccuracyBarProps> = ({ finalAccuracy, tempAccuracy }) => {
  return (
    <Box pb='sm'>
      <RingProgress
        size={80}
        thickness={8}
        roundCaps
        transitionDuration={250}
        sections={[{ value: finalAccuracy, color: finalAccuracy > 90 ? CatppuccinColors.Green : finalAccuracy > 70 ? CatppuccinColors.Yellow : CatppuccinColors.Red }]}
        label={
          <Text size="sm">
            {`${finalAccuracy.toFixed(0)}%`}
          </Text>
        }
      />
    </Box>
  )
};

export default AccuracyBar;
