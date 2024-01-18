# Projet Horloge/Alarme:

## Exigences:
- **node js**
- **react**
- **typescript**
- **docker** :  vous pouvez installer docker. [Check this tutorial for ubuntu](https://docs.docker.com/engine/install/ubuntu/) or [Check this tutorial for windows](https://docs.docker.com/docker-for-windows/install/).

## Exécuter la base de données:
Pour persister les alarmes dans une vraie base de données, nous avons utilisé une base de données postgresSql.

Nous utilisons l'image docker postgres et pour lancer le conteneur postgres, nous devons lancer la commande suivante :
* docker run --name postgres-container -e POSTGRES_PASSWORD=alarm123 -e POSTGRES_DB=database-alarm -d -p 5432:5432 postgres

## projet Backend:
Dans le projet Backend, on a implémenté la gestion d'alarme à travers un CRUD en ajoutant la pagination lors de la récupération de la liste des alarmes.
De plus, on a ajouté un ws pour l'activation ou la désactivation de l'alarme.

### Structure du projet:
On a choisi la structure suivante:
* business_object: définisse la logique métier
* controller: responsable de la gestion des requêtes et des réponses HTTP
* model: présente les entités
* route: définisse les endpoints
* config: contient les fichiers de configuration

Cette structure est bien organisée et extensible. Elle assure également la modulalité de l'application et la séparation des responsabilités.

### Exécuter le projet:
Pour lancer le projet, nous avons besoin d'avoir le conteneur de la base de données, nous devons lancer cette commande :
* npm install
* npm start

## projet Frontend:
Dans le projet Frontend, on a implémenté l'interface pour la gestion d'alarme avec des notifications.

### Structure du projet:
On a choisi la structure suivante:
* component: contient les composants qui sont des morceaux d'interface utilisateur qui encapsulent la logique et la présentation d'une partie spécifique de l'application
* service: encapsule la logique métier
* helpers: contient des fonctions utilitaires et des outils qui sont utilisés dans différentes parties de l'application
* styles: stocke les fichiers de styles CSS qui définissent l'apparence des composants

Cette structure assure la séparation des responsabilités.

### Exécuter le projet:
Pour lancer le projet, nous devons lancer cette commande :
* npm install
* npm start
  et par la suite, on doit naviguer sur le http://localhost:3000


## point d'amélioration:
* ajout d'autres fonctionnalités comme un chronometre pour l'utilisation dans des activités sportifs par exemple
* amélioration de l'interface IHM (style,...)