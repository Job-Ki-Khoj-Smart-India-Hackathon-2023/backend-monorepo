from generated.pgrkam_private_job_pb2 import PGRKAMPrivateJob, PGRKAMPrivateJobList
from generated.common_pb2 import Response



class PGRKAMPrivateJobController():

    def CreatePGRKAMPrivateJob(self) -> Response:
        return Response(ok=True, message="Job created successfully")

    def GetPGRKAMPrivateJobs(self) -> PGRKAMPrivateJobList:
        return PGRKAMPrivateJobList(ids=['1', '2', '3'])

    def UpdatePGRKAMPrivateJob(self) -> Response:
        return Response(ok=True, message="Job updated successfully")

    def DeletePGRKAMPrivateJob(self) -> Response:
        return Response(ok=True, message="Job deleted successfully")
