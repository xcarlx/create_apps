from django import forms

from modulo.models import TestData


class TestDataForm(forms.ModelForm):
    class Meta:
        model = TestData
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(TestDataForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = "form-control"
            self.fields[field].widget.attrs['placeholder'] = self.fields[field].label
