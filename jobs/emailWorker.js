import { Worker } from "bullmq";

const worker = new Worker('emailQueue', async (job) => {
    console.log(job.data);
},{
    connection: { host: 'localhost', port: 6379}
});

export default worker;