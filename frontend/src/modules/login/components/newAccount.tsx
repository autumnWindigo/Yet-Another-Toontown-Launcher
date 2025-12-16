import { useState } from "react";
// import { SaveAccount } from "../../../../bindings/YATL/services/loginservice";
// import { notifications } from "@mantine/notifications";
import { Box, Button, Stack, Stepper, Text, TextInput } from "@mantine/core";
import { IconCake, IconShieldCheck, IconUserCheck } from "@tabler/icons-react";
import { SaveAccount } from "../../../../bindings/YATL/services/loginservice.ts";
import { notifications } from "@mantine/notifications";

const NewAccount: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toonGuard, setToonGuard] = useState<string>("");
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));

  const handleNewAccount = async () => {
    await SaveAccount(username, password);
    notifications.show({
      title: "Adding Account to Keychain",
      message: username,
    });
  };

  return (
    <>
      <Stepper active={active} pl={10} pr={10}>
        <Stepper.Step icon={<IconUserCheck />} label="Login" description="Create an account">
          <Stack pt={20}>
            <Text>Login to TTR</Text>
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
                nextStep();
              }}
              variant="light"
            >
              Login
            </Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Step icon={<IconShieldCheck />} label="Verification" description="Toonguard">
          <Stack pt={20}>
            <Text>Please enter your toonguard code (Check your emails)</Text>
            <TextInput
              value={toonGuard}
              placeholder="Toon Guard Code"
              onChange={(e) => setToonGuard(e.target.value)}
            />
            <Button
              onClick={() => {
                nextStep();
              }}
              variant="light"
            >
              Verify
            </Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Step icon={<IconCake />} label="Confirmation" description="Add Account to YATL">
          <Box pt={20} pb={20}>
            <Text pb={20}>Everything Checks Out!</Text>
            <Button
              onClick={() => {
                nextStep();
                handleNewAccount();
              }}
              variant="light"
            >
              Add Account
            </Button>
          </Box>
        </Stepper.Step>
        <Stepper.Completed>
          <Text pt={20}>Account Added To YATL!</Text>
        </Stepper.Completed>
      </Stepper>
    </>
  )
}

export default NewAccount;
