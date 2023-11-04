import pinecone
from generated.jkk_job_pb2 import JKKJob, JKKJobList
from generated.common_pb2 import Response


class JKKJobController():

    def CreateJKKJob(self):
        return Response(ok=True, message='Job created successfully')

    def GetJKKJobs(self):
        return JKKJobList(ids=['job1', 'job2', 'job3'])

    def UpdateJKKJob(self):
        return Response(ok=True, message='Job updated successfully')

    def DeleteJKKJob(self):
        return Response(ok=True, message='Job deleted successfully')


