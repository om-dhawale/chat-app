import { Queue } from "bullmq";

const emailQueue = new Queue('emailQueue', {
    connection : { host: 'localhost', port: 6379}
});

export default emailQueue;