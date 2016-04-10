Feature: The project introduction page

  Scenario: The main view
    Given a demo app
    When I load the page
    Then I should see the jumbotron with correct data
    And I should see a list of more than 5 awesome things