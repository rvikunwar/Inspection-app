from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Areas(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.name


class Entity(models.Model):
    name = models.CharField(max_length=500)
    person_in_charge = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    email = models.EmailField()
    phone_number = models.IntegerField(null=True, blank=True)
    areas = models.ManyToManyField(Areas, blank=True)

    def __str__(self):
        return self.name


STATUS_CHOICES = (
    ('COMPLETED', 'COMPLETED'),
    ('NEW', 'NEW'),
    ('RE-ASSIGNED', 'RE-ASSIGNED'),
    ('ISSUE', 'ISSUE'),
    ('PROCESSING', 'PROCESSING'),
)

PRIORITY_CHOICES = (
    ('URGENT', 'URGENT'),
    ('HIGH', 'HIGH'),
    ('MEDIUM', 'MEDIUM'),
    ('LOW', 'LOW')
)


class TaskAssigned(models.Model):
    title = models.CharField(max_length=500)
    description = models.TextField()
    assigned_to = models.ForeignKey(User, related_name="assignedBy",
                                    on_delete=models.SET_NULL, null=True)
    assigned_by = models.ForeignKey(User, related_name="assignedTo",
                                    on_delete=models.SET_NULL, null=True)
    entity = models.ForeignKey(Entity, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    status = models.CharField(choices=STATUS_CHOICES, max_length=50, default="NEW")
    end_date = models.DateField()
    priority = models.CharField(choices=PRIORITY_CHOICES, max_length=50)
    reason_for_reassigning = models.TextField(blank=True)

    def __str__(self):
        return self.title


TODO_STATUS = (
    ('COMPLETED', 'COMPLETED'),
    ('PROCESSING', 'PROCESSING'),
    ('NEW', 'NEW')
)


class Todo(models.Model):
    title = models.CharField(max_length=500)
    description = models.TextField()
    task = models.ForeignKey(TaskAssigned, on_delete=models.CASCADE)
    status = models.CharField(choices=TODO_STATUS, max_length=50 , default='NEW')

    def __str__(self):
        return self.title


class Files(models.Model):
    file = models.FileField(upload_to="files")
    task = models.ForeignKey(TaskAssigned, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name.split('/')[1]
