Feature: Tailtrix_login Authentication

  Scenario: Login & logut should be success
    Given User navigative to Tailtrix application
    When User enter valid Email address
    When User enter valid password
    Then User able to click on Login button
    When User is able to render Talitrix Application
    Then User should be able to go to the right top of the page and click on manage account icon
    When User should be able to click on the icon to view below records Profile Settings Logout
    Then User should be able to click on Logout button
    When User should be able to Logout from the application and should appear login page
