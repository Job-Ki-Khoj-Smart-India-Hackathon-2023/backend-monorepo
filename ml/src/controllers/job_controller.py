import generated.job_service_pb2_grpc as grpc
import controllers.jkk_job_controller as jkk
import controllers.pgrkam_private_job_controller as pgrkam


class JobController(grpc.JobServiceServicer):

    def __init__(self):
        self.jkk = jkk.JKKJobController()
        self.pgrkam = pgrkam.PGRKAMPrivateJobController()

    def CreatePGRKAMPrivateJob(self, request, context):
        return self.pgrkam.CreatePGRKAMPrivateJob()

    def GetPGRKAMPrivateJobs(self, request, context):
        return self.pgrkam.GetPGRKAMPrivateJobs()

    def UpdatePGRKAMPrivateJob(self, request, context):
        return self.pgrkam.UpdatePGRKAMPrivateJob()

    def DeletePGRKAMPrivateJob(self, request, context):
        return self.pgrkam.DeletePGRKAMPrivateJob()

    def CreateJKKJob(self, request, context):
        return self.jkk.CreateJKKJob()

    def GetJKKJobs(self, request, context):
        return self.jkk.GetJKKJobs()

    def UpdateJKKJob(self, request, context):
        return self.jkk.UpdateJKKJob()

    def DeleteJKKJob(self, request, context):
        return self.jkk.DeleteJKKJob()


