/**
 * Retrieves data of a given issue.
 *
 * @param {number} issue - The issue node ID.
 *
 * @return {array|string} - Array of JSON data, or empty string if failed.
 */
function drupalOrgIssueFetch(issue_number) {
  // Don't proceed if there's bogus input.
  if (issue_number == '') {
    return '';
  }

  // First, attempt to retrieve from cache.
  var cache = CacheService.getPublicCache();
  var cached = cache.get('drupal.org-issue-' + issue_number);
  if (cached != null) {
    return cached;
  }

  // If that fails, query Drupal.org.
  var response = UrlFetchApp.fetch('https://www.drupal.org/api-d7/node.json?nid=' + issue_number);
  if (response.getResponseCode() !== 200) {
    return {};
  }
  // Store results in cache for next time.
  var contents = JSON.parse(response.getContentText());
  cache.put('drupal.org-issue-' + issue_number, contents, 300); /* Cache for 5 minutes */
  return contents;
}

/**
 * Retrieves specific property of a given issue.
 *
 * @param {string} property - The property to retrieve, e.g. "title", "field_issue_version".
 */
function drupalOrgIssueProperty(issue_number, property) {
  // Don't proceed if there's bogus input.
  if (issue_number == '') {
    return '';
  }
  
  if (typeof issue_number != 'number') {
    return('error: input must be a number');
  }

  var issue = drupalOrgIssueFetch(issue_number);
  var foo = 'bar';

  return issue.list[0][property] || '';
}

/**
 * Translates Drupal.org issue status IDs to plain English.
 */
function drupalOrgIssueStatus(status) {
  switch (status) {
    case '1':
      return 'Active';
    case '2':
      return 'Fixed';
    case '3':
      return 'Closed (duplicate)';
    case '4':
      return 'Postponed';
    case '5':
      return "Closed (won't fix)";
    case '6':
      return 'Closed (works as designed)';
    case '7':
      return 'Closed (fixed)';
    case '8':
      return 'Needs review';
    case '13':
      return 'Needs work';
    case '14':
      return 'Reviewed & tested by the community';
    case '15':
      return 'Patch (to be ported)';
    case '16':
      return 'Postponed (maintainer needs more info)';
    case '18':
      return 'Closed (cannot reproduce)';
  }
}

/**
 * Translates Drupal.org issue priority IDs to plain English.
 */
function drupalOrgIssuePriority(priority) {
  switch (priority) {
    case '400':
      return 'Critical';
    case '300':
      return 'Major';
    case '200':
      return 'Normal';
    case '100':
      return 'Minor';
  }
}
