const { exec } = require("node:child_process");

const NOT_FOUND = -1;

async function checkPostgres() {
  const ora = (await import("ora")).default;
  const spinner = ora({
    text: "Aguardando postgres aceitar conexões...",
    color: "yellow",
  }).start();

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === NOT_FOUND) {
      spinner.text = "Aguardando postgres aceitar conexões...";
      setTimeout(
        () => exec("docker exec postgres-dev pg_isready", handleReturn),
        1000,
      );
      return;
    }

    spinner.succeed("\n🟢 Postgres está pronto e aceitando conexões!\n");
  }
}

checkPostgres();
