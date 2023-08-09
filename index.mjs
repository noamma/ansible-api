import express from 'express';
import { spawn } from 'child_process';
import dotenv  from 'dotenv';

dotenv.config();
const ansible_path = process.env.ANSIBLE_PATH;
const result = async(cmd, response) => {
  const arr  = cmd.split(" ");
  const _exec = arr.shift();
  const param = arr;
    const ls = spawn(ansible_path + _exec, param);

    ls.stdout.on("data", data => {
        response.write(data);
    });

    ls.stderr.on("data", data => {
        response.write(`Output Error: ${data}`);
    });

    ls.on('error', (error) => {
        response.write(`Error: ${error.message}`);
    });

    ls.on("close", code => {
        console.log(`command exited with code ${code}`);
        response.end('END.')
    });
}

const app = express();
const port = 3000;
app.get('/api/', (request, response) => {
  return response.send('ansible api is up');
});
app.get('/api/list-hosts',async(request, response) => {
    result("ansible all --list-host",response);
  });
app.get('/api/ping-hosts',async(request, response) => {
    result("ansible all -m ping",response);
  });
  app.get('/api/apt-update',async(request, response) => {
    result("ansible all -m apt -a update_cache=true --become",response);
  });
app.listen(3000, () => {
  console.log(`App is listening on port ${port}`);
});