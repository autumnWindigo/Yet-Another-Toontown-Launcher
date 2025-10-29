import React, { useState } from "react";
import { SaveAccount } from "../../../bindings/YATL/services/loginservice";
import {
  Card,
  Drawer,
  Group,
  Image,
  SimpleGrid,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { LoginProps } from "./LoginTypes";

const LoginPage: React.FC<LoginProps> = ({
  handlePlay,
  processIDs,
  accounts,
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  const handleNewAccount = async () => {
    await SaveAccount(username, password);
    notifications.show({
      title: "Adding Account to Keychain",
      message: username,
    });
  };

  // TODO: Add button for restart
  return (
    <>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="all">
            All
          </Tabs.Tab>
          <Tabs.Tab value="rewritten">
            Rewritten
          </Tabs.Tab>
          <Button justify="right" ml="auto" variant="subtle" onClick={open}>
            Add Acount
          </Button>
        </Tabs.List>
      </Tabs>
      <Space h={20} />
      <div>
        <SimpleGrid cols={3}>
          {accounts.map((account) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{}}>
              <Card.Section>
                <Image
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.launchbox-app.com%2Fecc3fbf4-624b-447a-8eeb-c8700041dc26.png"
                  height={80}
                />
              </Card.Section>
              <Card.Section>
                <Text size="xl" fw={500}>{account}</Text>
                {processIDs[account] !== -1 && (
                  <Text size="sm" c="green">
                    Running (PID: {processIDs[account]})
                  </Text>
                )}
              </Card.Section>
              <Card.Section>
                <Group justify="space-around" mt="md" mb="xs">
                  <Button
                    variant="light"
                    onClick={() =>
                      handlePlay(account)}
                  >
                    Play
                  </Button>
                </Group>
              </Card.Section>
            </Card>
          ))}
        </SimpleGrid>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title="Add Account"
        position="right"
        offset={8}
        radius="md"
        size={300}
        style={{}}
      >
        <Stack>
          <TextInput
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={() => {
              handleNewAccount();
            }}
            variant="light"
          >
            Submit
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default LoginPage;
