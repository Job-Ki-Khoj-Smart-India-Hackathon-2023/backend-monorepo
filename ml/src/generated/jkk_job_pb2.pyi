import common_pb2 as _common_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class JKKJob(_message.Message):
    __slots__ = ["mongo_id", "job_title", "description", "location"]
    MONGO_ID_FIELD_NUMBER: _ClassVar[int]
    JOB_TITLE_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    LOCATION_FIELD_NUMBER: _ClassVar[int]
    mongo_id: str
    job_title: str
    description: str
    location: _common_pb2.Location
    def __init__(self, mongo_id: _Optional[str] = ..., job_title: _Optional[str] = ..., description: _Optional[str] = ..., location: _Optional[_Union[_common_pb2.Location, _Mapping]] = ...) -> None: ...

class JKKJobList(_message.Message):
    __slots__ = ["ids"]
    IDS_FIELD_NUMBER: _ClassVar[int]
    ids: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, ids: _Optional[_Iterable[str]] = ...) -> None: ...
