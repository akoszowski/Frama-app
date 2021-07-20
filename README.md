# Frama-app
This is a project for WWW Application course at the University of Warsaw.  

Application initially developed in Django, however finally rewritten in Node.js (as for Version II in iteration 4).

## Iteration 1: mock-up of the app interface

The goal of the assignments in this course is to create a web application in which one can write down and prove invariants for simple programs. We assume that the code will be written in C and the invariants will be encoded in an ACSL. One may view this as a simplified version of the Frama-C program.

The goal of the first assignment is to create a general view, i.e. mock-up, of the application in a web browser. The general format of the application page should follow the layout on the following picture

![](https://github.com/akoszowski/Frama-app/blob/master/layout.png)

---

## Iteration 2: server side of the application (data model, page templates, link-button interface)

In this iteration of the application you have to develop data model, page templates and link-button interface to the application.

### Data model

You have to create a data model with the following entities:

    - Directory - is an entity that holds files and other directories. In addition to descriptions of relations with other entities, it has:
       - a name,
       - an optional description,
       - a creation date
       - an owner
       - an availability flag (false if the directory was deleted)
    - File - is an entity that contains a source code, the source code is divided into sections. In addition to descriptions of relations with other entities, it has:
       - a name,
       - an optional description,
       - a creation date,
       - an owner
       - an availability flag (false if the file was deleted)
    - File section - is an entity that contains a meaningful piece of code within a file or comments; some file sections may contain subsections. In addition to descriptions of relations with other entities, it has:
       - an optional name,
       - an optional description,
       - a creation date,
       - a section category,
       - a status,
       - status data
    - Section category - is an entity that defines the type of a section; category defines the way the file section is handled by the application. Possible section categories are: procedure, property, lemma, assertion, invariant, precondition, postcondition; some file sections may contain subsections.
    - Section status - is an entity that defines the status of a section; example status' are: proved, invalid, counterexample, unchecked.
    - Status data - is an entity that defines data associated with the section status, e.g. the counterexample content, the name of the solver that proved validity (e.g. Z3, CVC4 etc.).
       - a status data field
       - a user
    - User – is an entity that defines a user of the application.
       - a name
       - a login
       - a password

All the entities have a timestamp and a validity flag. The actual model may contain more entities and each of the entities may have more properties.

### Link-button interface and templates

The application should display in the File selection dialog the available in the database directory structure. The file selection dialog should be implemented as appropriate template fed with data from the database.
The application should make it possible to add a file to the database and to divide the file into sections of mentioned above categories. This should be done by using an appropriate option in the menu bar.
The application should make it possible to add a directory to the database. This should be done by using an appropriate option in the menu bar.
The application should make it possible to delete a file or a directory from the application (the file should not be deleted completely from the database, it should only be marked as not available). This should be done by using an appropriate option in the menu bar and by means of an appropriate selection of the file or a directory.
The application should display in the Focus on program elements section of the screen the output of the command

      $ frama-c -wp -wp-print <filename>.c                    

where filename.c corresponds to the currently selected file. The output should be parsed into ranges inbetween dashed lines, which describe verification conditions, so that line numbers visible in each of the ranges are related to parsed sections of the input file and the names of the sections should appear in tool tips when mouse is hovered over the range text. Also status of the verification for each of the conditions (Valid, Unknown etc.) should be parsed and the content should be displayed using different decorations depending on the status (eg. on different background).
Appropriate template should be used to display this section properly.
Three tabs should be available in the bottom part of the screen. Their content is described below.
The first tab (titled PROVERS) should contain a list of provers available for discharging the verification conditions generated for the chosen file (at least Alt-Ergo, Z3 and CVC4). It should be possible to choose one of the provers to discharge the goals and submit the choice to the application with a button in the tab.
The second tab (titled VCs) should make it possible to choose runtime guard verification conditions (VCs), see option -wp-rte of frama-c, and should make it possible to choose different kinds of VCs that can be specified with the option -wp-prop="...". It should be possible to submit the choice to the application with a button in the tab.
The third tab (titled RESULT) should contain the summary of the verification process available in the file result.txt after running the command

     $ frama-c -wp -wp-log="r:result.txt"  <filename>.c
              

Menu should contain an option to rerun verification operation on the current file. It should be run depending on the chosen configuration of proovers and verification conditions. Example commands that can be run here are

     $ frama-c -wp -wp-prover alt-ergo -wp-prop="-@invariant" <filename>.c
     $ frama-c -wp -wp-prover alt-ergo -wp-rte  <filename>.c
     $ frama-c -wp -wp-prover alt-ergo -wp-prop="-@invariant" -wp-rte  <filename>.c

The application should memorise the status of proving for obligations.

---

## Iteration 3: server side of the application (parsing of data from UI, interaction with external programs on the server side) 

In this iteration of the application you have to extend the functionality of the application by adding a number of features as well as enhance the robustness of the application.

### Additional features

* You have to add the infrastructure to login users. The users can be added with help of the admin interface. Files and directories added by a user are owned by the same user.
* User experience should be made better by avoiding the need to reload the whole page each file operation is done.
* User experience should be made better by avoiding the need to reload the whole page each menu operation is done.
* User experience should be made better by introduction of the possibility to hide and unhide the content of ranges displayed in the Focus on program elements section. The numbers of lines that indicate the borders of the ranges should be made visible even though the content is hidden. Also some decoration of the hidden range should make visible its status (Valid, Unknown, etc.)

### Enhancing robustness of the application

Introduce tests on the server side of the application. The tests should check the models, views and forms used in the application. This activity will be continued and enhanced in the fourth assignment.

---

## Iteration 4: active UI

The assignment has two optional versions. Either one can result in up to 10 points. It is not possible to return combination of the two versions (all points are scored either for the first version or for the second one).

### Version I - deployed Django application

The goal of this version of the assignment is to gain end-to-end acquiaintance with one web framework, including the final phase of polishing up the application.

    * The application developed under assignments 1-3 deployed under nginx, apache or other production strength web server (2 points)
    * Integration of the code editor Codemirror with the application (2 points)
    * Syntax colouring of the ACSL specifications located in comments (1 point)
    * A nice, polished up interface with the user (1 point)
    * At least 60% of code coverage (1 point) as measured by running

    > coverage run --source='source_name' manage.py test app_name

    and showed by

    > coverage report

    * At least 70% of code coverage (1 point) as measured by running commands as above.
    * At least 80% of code coverage (1 point) as measured by running commands as above.
    * At least 85% of code coverage (0,5 point) as measured by running commands as above.
    * At least 90% of code coverage (0,5 point) as measured by running commands as above.
    
### Version II - application rewritten in Node.js

The goal of this version of the assignment is to get acquaintance with another web framework. In this version of the assignment, one has to provide an alternative version of the functionality covered in Assignment 2 and integrate it with the functionality of Assignment 3.

#### Points

    * Directory and file navigation, adding, deleting- 1 point
    * Parsing of the file into sections - 1 points
    * Content of the Focus on program elements - 1 point
    * Proper handling of prover choice - 1 point
    * Proper handling of verification conditions to prove - 1 point
    * Proper presentation of the proving result  - 1 point
    * Infrastructure to login users - 1 point
    * No unnecessary page reloads - 1 point
    * Hiding and unhiding of ranges displayed in the Focus on program elements section - 1 point
    * Available testing infrastructure akin - 1 point

