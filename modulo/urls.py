"""create_apps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import SuccessView, HomeView, ListaView, TableListaView, CrearView, EditarView, EliminarView, ComboView, \
    VistaMaterialView, TablaComponetsView

app_name = "modulo"
urlpatterns = [
    path('success/<int:pk>/', SuccessView.as_view(), name='success'),
    path('test/home/', HomeView.as_view(), name='test-home'),
    path('test/lista/', ListaView.as_view(), name='test-lista'),
    path('test/table/lista/', TableListaView.as_view(), name='test-table-lista'),
    path('test/crear/', CrearView.as_view(), name='test-crear'),
    path('test/editar/<int:pk>/', EditarView.as_view(), name='test-editar'),
    path('test/eliminar/<int:pk>/', EliminarView.as_view(), name='test-eliminar'),
    path('test/combo/', ComboView.as_view(), name='test-combo'),
    path('test/material/', VistaMaterialView.as_view(), name='material'),
    path('test/ajaxtable/', TablaComponetsView.as_view(), name='ajax-table'),

]
