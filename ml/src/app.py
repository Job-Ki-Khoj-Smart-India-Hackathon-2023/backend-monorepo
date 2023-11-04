import grpc
import sys
import os
from concurrent import futures
from dotenv import load_dotenv, find_dotenv
from generated.job_service_pb2_grpc import add_JobServiceServicer_to_server 
from controllers.job_controller import JobController


env_path = find_dotenv('.env')
load_dotenv(env_path)

print(sys.path)
def main():
    address = os.getenv("ADDR") 
    if os.getenv("ADDR") is None:
        print('Unable to find PORT in .env file. Using default port 50051')
        address = "0.0.0.0:50051"
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=100))
    server.add_insecure_port(str(address))
    add_JobServiceServicer_to_server(JobController(), server)
    server.start()
    print(f'Server started at {address}') 
    server.wait_for_termination()

if __name__ == '__main__':
    main()
