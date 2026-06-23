
@ECHO OFF
CHCP 65001 >nul

REM === Paramètres configurables ===
REM Utiliser GitHub Container Registry pour le dépôt SolaireFR/reservia
SET REGISTRY=ghcr.io/solairefr
SET PACKAGE_NAME=reservia
SET DOCKERFILE=Dockerfile

REM Arguments passés au script
SET ARG_LIST=%*

ECHO Récupération des informations...

REM Vérification de l'existence des fichiers requis
if NOT EXIST %DOCKERFILE% (
    ECHO Fichier %DOCKERFILE% introuvable.
    PAUSE
    EXIT /B 1
)

REM Création des packages demandés : %ARG_LIST%
FOR %%A IN (%ARG_LIST%) DO (
    ECHO Création du package %PACKAGE_NAME%:%%A...
    docker build -t %REGISTRY%/%PACKAGE_NAME%:%%A . && docker image push %REGISTRY%/%PACKAGE_NAME%:%%A && docker image rm %REGISTRY%/%PACKAGE_NAME%:%%A
)