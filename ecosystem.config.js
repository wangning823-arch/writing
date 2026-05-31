module.exports = {
  apps: [
    {
      name: "writing",
      script: "npm",
      args: "run dev -- -p 3004",
      cwd: "/home/root1/users/admin/projects/writing",
      env: {
        NODE_ENV: "development",
        PORT: 3004,
      },
    },
  ],
};
