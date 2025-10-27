import React, { useState } from "react";
import { CogStatusMenuProps, Location, statuses } from "./CalcTypes";
import { Box, Checkbox, Collapse, Group, Rating, Stack, Text } from "@mantine/core";
import { IconChevronDownRight, IconChevronRight } from "@tabler/icons-react"

const CogStatusMenu: React.FC<CogStatusMenuProps> = (
  { checkedStatuses, onStatusCheck },
) => {
  const [expandedGroups, setExpandedGroups] = useState<
    Record<Location, boolean>
  >(() => {
    const initState: Record<Location, boolean> = Object.values(Location).reduce(
      (acc, loc) => {
        acc[loc as Location] = true;
        return acc;
      },
      {} as Record<Location, boolean>,
    );

    return initState;
  });

  const onToggleLocation = (location: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  return (
    <Stack>
      {Object.values(Location).map((location) => {
        const expanded = expandedGroups[location];
        const filteredStatuses = statuses.filter(
          (status) => status.location === location
        );

        return (
          <Box key={location}>
            <Group
              onClick={() => onToggleLocation(location)}
              align="center"
            >
              {expanded ? (
                <IconChevronDownRight size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}
              <Text>{location}</Text>

              {location === "FieldOffice" && (
                <Rating defaultValue={1} count={4} size="sm" />
              )}
            </Group>

            <Collapse in={expanded}>
              <Stack pl="lg" mt="xs">
                {filteredStatuses.map((status) => (
                  <Checkbox
                    key={status.status}
                    label={status.status}
                    checked={!!checkedStatuses[status.status]}
                    onChange={() => onStatusCheck(status.status)}
                  />
                ))}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
};

export default CogStatusMenu;
